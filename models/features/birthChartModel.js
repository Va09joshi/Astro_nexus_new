const mongoose = require("mongoose");

const birthChartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // track user
  name: String,
  gender: String,
  birth_date: {
    year: Number,
    month: Number,
    day: Number,
  },
  birth_time: {
    hour: Number,
    minute: Number,
    ampm: String,
  },
  place_of_birth: String,
  astrology_type: String,
  ayanamsa: String,
  
  chartImage: String, // PNG path
  chartData: mongoose.Schema.Types.Mixed, // full birth chart JSON
  rashi: String, // optional for easy query
}, { timestamps: true });

module.exports = mongoose.model("BirthChart", birthChartSchema);