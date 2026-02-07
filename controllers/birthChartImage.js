const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const BirthChart = require("../models/birthChartModel.js");

exports.generateBirthChart = async (req, res) => {
  try {
    const {
      name,
      gender,
      birth_date,
      birth_time,
      place_of_birth,
      astrology_type,
      ayanamsa,
    } = req.body;

    // ================= CALL ASTROLOGY API =================
    const apiResponse = await axios.post(
      "https://astro-nexus-backend-9u1s.onrender.com/api/v1/chart",
      {
        name,
        gender,
        birth_date,
        birth_time,
        place_of_birth,
        astrology_type,
        ayanamsa,
      }
    );

    const chartData = apiResponse.data;

    // ================= CREATE CHART IMAGE =================
    const canvasSize = 900;
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;

    // Outer square
    ctx.strokeRect(50, 50, 800, 800);

    // Diagonals
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(850, 850);
    ctx.moveTo(850, 50);
    ctx.lineTo(50, 850);
    ctx.stroke();

    // Middle diamond lines
    ctx.beginPath();
    ctx.moveTo(450, 50);
    ctx.lineTo(850, 450);
    ctx.lineTo(450, 850);
    ctx.lineTo(50, 450);
    ctx.closePath();
    ctx.stroke();

    ctx.font = "28px Arial";
    ctx.fillStyle = "#000";

    // House labels (North Indian Style)
    const housePositions = [
      { h: "H1", x: 430, y: 470 },
      { h: "H2", x: 430, y: 120 },
      { h: "H3", x: 120, y: 300 },
      { h: "H4", x: 250, y: 470 },
      { h: "H5", x: 120, y: 650 },
      { h: "H6", x: 430, y: 780 },
      { h: "H7", x: 430, y: 600 },
      { h: "H8", x: 650, y: 780 },
      { h: "H9", x: 780, y: 650 },
      { h: "H10", x: 650, y: 470 },
      { h: "H11", x: 780, y: 300 },
      { h: "H12", x: 650, y: 120 },
    ];

    housePositions.forEach(pos => ctx.fillText(pos.h, pos.x, pos.y));

    // ================= SAVE IMAGE =================
    const chartsDir = path.join(__dirname, "../charts");
    if (!fs.existsSync(chartsDir)) fs.mkdirSync(chartsDir);

    const fileName = `chart_${Date.now()}.png`;
    const filePath = path.join(chartsDir, fileName);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    // ================= SAVE TO MONGODB =================
    const newChart = await BirthChart.create({
      name,
      gender,
      birth_date,
      birth_time,
      place_of_birth,
      astrology_type,
      ayanamsa,
      chartImage: `/charts/${fileName}`,
      chartData // full astrology API response saved
    });

    res.status(201).json({
      success: true,
      message: "Birth chart generated successfully",
      data: newChart,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Error generating birth chart",
      error: error.message,
    });
  }
};
