import axios from "axios";
import User from "../../models/user.js";

const sendToMatiAI = async (payload, retries = 2) => {
  try {
    return await axios.post(
      "https://mati-ai.onrender.com/chat",
      payload,
      { timeout: 15000 } // 15s safety timeout
    );
  } catch (err) {
    if (err.response?.status === 429 && retries > 0) {
      console.log("⏳ Mati AI rate limited. Retrying in 6 seconds...");
      await new Promise(res => setTimeout(res, 6000));
      return sendToMatiAI(payload, retries - 1);
    }
    throw err;
  }
};

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

    // 🔹 1. Try DB birth data
    const user = await User.findOne({ sessionId: session_id }).select("name astrologyProfile");

    if (user && user.astrologyProfile?.dateOfBirth) {
      const dob = new Date(user.astrologyProfile.dateOfBirth);

      let [hour, minute] = user.astrologyProfile.timeOfBirth.split(":").map(Number);

      // Convert 24h → 12h format for API
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;

      payloadBirthInput = {
        name: user.name,
        gender: user.astrologyProfile.gender || "male",
        birth_date: {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate()
        },
        birth_time: { hour, minute, ampm },
        place_of_birth: user.astrologyProfile.placeOfBirth,
        astrology_type: "vedic",
        ayanamsa: "lahiri"
      };
    }

    // 🔹 2. Fallback to request birth_input
    else if (birth_input) {
      payloadBirthInput = birth_input;
    }

    // 🔹 3. No birth data anywhere
    else {
      return res.status(400).json({
        success: false,
        message: "Birth details required either from profile or request"
      });
    }

    // 🚀 Send request with retry protection
    const aiResponse = await sendToMatiAI({
      session_id,
      birth_input: payloadBirthInput,
      question
    });

    return res.json({
      success: true,
      session_id,
      answer: aiResponse.data.answer || aiResponse.data.response || aiResponse.data
    });

  } catch (error) {
    console.error("Chatbot Error:", error.response?.data || error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Astrology service is busy. Please try again in a minute."
      });
    }

    res.status(500).json({
      success: false,
      message: "Chatbot service failed",
      error: error.response?.data || error.message
    });
  }
};
