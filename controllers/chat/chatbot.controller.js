import axios from "axios";
import User from "../../models/user.js";

export const askAstrologyChatbot = async (req, res) => {
  try {
    const { session_id, question, birth_input } = req.body;

    if (!session_id || !question) {
      return res.status(400).json({
        success: false,
        message: "session_id and question are required"
      });
    }

    let payloadBirthInput;

    // 🔹 1. Try getting birth data from DB
    const user = await User.findOne({ sessionId: session_id }).select("name astrologyProfile");

    if (user && user.astrologyProfile?.dateOfBirth) {
      const dob = new Date(user.astrologyProfile.dateOfBirth);
      const [hour, minute] = user.astrologyProfile.timeOfBirth.split(":").map(Number);

      payloadBirthInput = {
        name: user.name,
        gender: user.astrologyProfile.gender || "male",
        birth_date: {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate()
        },
        birth_time: {
          hour,
          minute,
          ampm: hour >= 12 ? "PM" : "AM"
        },
        place_of_birth: user.astrologyProfile.placeOfBirth,
        astrology_type: "vedic",
        ayanamsa: "lahiri"
      };
    }

    // 🔹 2. If DB data not found, use request birth_input
    else if (birth_input) {
      payloadBirthInput = birth_input;
    }

    // 🔹 3. If still no birth data → error
    else {
      return res.status(400).json({
        success: false,
        message: "Birth details required either from profile or request"
      });
    }

    // 🚀 Send to Mati AI
    const aiResponse = await axios.post(
      "https://mati-ai.onrender.com/chat",
      {
        session_id,
        birth_input: payloadBirthInput,
        question
      }
    );

    return res.json({
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
