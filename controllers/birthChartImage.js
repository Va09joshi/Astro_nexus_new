const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const BirthChart = require("../models/birthChartModel");

const planetColors = {
  Sun: "#ff6600",
  Moon: "#666666",
  Mars: "#cc0000",
  Mercury: "#009933",
  Jupiter: "#cc9900",
  Venus: "#ff3399",
  Saturn: "#000099",
  Rahu: "#660099",
  Ketu: "#663300",
  Uranus: "#009999",
  Neptune: "#333399",
  Pluto: "#000000"
};

exports.generateBirthChart = async (req, res) => {
  try {
    const body = req.body;

    // 🔮 Call astrology API
    const apiRes = await axios.post(
      "https://astro-nexus-backend-9u1s.onrender.com/api/v1/chart",
      body
    );

    const chartData = apiRes.data;

    // 🧭 TRUE NORTH INDIAN HOUSE CENTERS (FIXED)
    const H = {
      1:{x:450,y:260},
      2:{x:240,y:120},   // ✅ Top center fixed
      3:{x:105,y:250},
      4:{x:240,y:470},
      5:{x:130,y:650},
      6:{x:250,y:768},   // ✅ Bottom center fixed
      7:{x:450,y:610},
      8:{x:660,y:780},
      9:{x:790,y:650},
      10:{x:630,y:470},
      11:{x:770,y:260},
      12:{x:650,y:150}
    };

    // 🎨 Canvas setup
    const canvas = createCanvas(900, 900);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f8f1e4";   // warm parchment / panchang paper tone
    ctx.fillRect(0, 0, 900, 900);


    ctx.strokeStyle = "#4e342e";   // deep brown sacred-ink tone
    ctx.lineWidth = 3;


    ctx.strokeRect(50, 50, 800, 800);

    ctx.beginPath();
    ctx.moveTo(50, 50); ctx.lineTo(850, 850);
    ctx.moveTo(850, 50); ctx.lineTo(50, 850);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(450, 50);
    ctx.lineTo(850, 450);
    ctx.lineTo(450, 850);
    ctx.lineTo(50, 450);
    ctx.closePath();
    ctx.stroke();

    ctx.textAlign = "center";

    // 🏠 Draw houses, signs, planets
    Object.entries(H).forEach(([num, pos]) => {
      const house = chartData.houses[num];
      if (!house) return;

      let y = pos.y - 35;

      // House label
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`H${num}`, pos.x, y);

      // Zodiac sign
      y += 20;
      ctx.font = "18px Arial";
      ctx.fillText(house.sign, pos.x, y);

      // Planets (full names)
      if (house.planets.length) {
        y += 24;
        house.planets.forEach((p, i) => {
          ctx.fillStyle = planetColors[p] || "#000";
          ctx.font = "bold 22px Arial";
          ctx.fillText(p, pos.x, y + (i * 18));
        });
      }
    });

    // 🌟 Ascendant
    const ascHouse = chartData.ascendant?.house;
    if (ascHouse && H[ascHouse]) {
      ctx.fillStyle = "red";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Ascendant", H[ascHouse].x, H[ascHouse].y - 60);
    }

    // 💾 Save image
    const dir = path.join(__dirname, "../charts");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fileName = `chart_${Date.now()}.png`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    // 🗄 Save DB
    const saved = await BirthChart.create({
      ...body,
      chartImage: `/charts/${fileName}`,
      chartData
    });

    res.status(201).json({
      success: true,
      message: "Birth chart generated with corrected house alignment",
      data: saved
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Chart generation failed",
      error: err.message
    });
  }
};
