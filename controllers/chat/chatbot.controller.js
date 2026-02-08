import axios from "axios";
import User from "../../models/user.js";

export const askAstrologyChatbot = async (req, res) => {
  try {
    const { session_id, question } = req.body;

    if (!session_id || !question) {
      return res.status(400).json({ success: false, message: "session_id and question are required" });
    }

    // 🔍 Find user by sessionId
    const user = await User.findOne({ sessionId: session_id }).select("+astrologyProfile name");
    if (!user || !user.astrologyProfile) {
      return res.status(404).json({ success: false, message: "User birth data not found" });
    }

    const dob = new Date(user.astrologyProfile.dateOfBirth);

    // 🧬 Build payload for Mati AI
    const payload = {
      session_id,
      birth_input: {
        name: user.name,
        gender: user.astrologyProfile.gender || "male",
        birth_date: {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate()
        },
        birth_time: {
          hour: parseInt(user.astrologyProfile.timeOfBirth.split(":")[0]),
          minute: parseInt(user.astrologyProfile.timeOfBirth.split(":")[1]),
          ampm: parseInt(user.astrologyProfile.timeOfBirth.split(":")[0]) >= 12 ? "PM" : "AM"
        },
        place_of_birth: user.astrologyProfile.placeOfBirth,
        astrology_type: "vedic",
        ayanamsa: "lahiri"
      },
      question
    };

    // 🚀 Send to Mati AI
    const aiResponse = await axios.post("https://mati-ai.onrender.com/chat", payload);

    res.json({
      success: true,
      session_id,
      answer: aiResponse.data.answer || aiResponse.data.response || aiResponse.data
    });

  } catch (error) {
    console.error("Chatbot Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Chatbot service failed",
      error: error.response?.data || error.message
    });
  }
};
