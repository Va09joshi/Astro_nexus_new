import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class BirthChartScreen extends StatelessWidget {
  const BirthChartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> planetData = [
      {"planet": "Sun", "sign": "Leo", "degree": "12°34'", "icon": Icons.wb_sunny},
      {"planet": "Moon", "sign": "Cancer", "degree": "05°12'", "icon": Icons.nightlight_round},
      {"planet": "Mercury", "sign": "Virgo", "degree": "17°42'", "icon": Icons.message},
      {"planet": "Venus", "sign": "Libra", "degree": "23°10'", "icon": Icons.favorite},
      {"planet": "Mars", "sign": "Scorpio", "degree": "02°58'", "icon": Icons.whatshot},
    ];

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        centerTitle: true,
        title: Text(
          "Birth Chart",
          style: GoogleFonts.dmSans(
            color: const Color(0xff1f1f3a),
            fontSize: 24,
            fontWeight: FontWeight.w700,
          ),
        ),
        iconTheme: const IconThemeData(color: Color(0xff1f1f3a)),
      ),

      body: Stack(
        children: [
          // 🌌 Background Decorative Circles
          Positioned(
            top: -90,
            left: -70,
            child: Container(
              width: 220,
              height: 220,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x33a8a8ff)
              ),
            ),
          ),
          Positioned(
            bottom: -120,
            right: -80,
            child: Container(
              width: 260,
              height: 260,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x403B3B98)
              ),
            ),
          ),

          // 🌠 Main Scrollable Content
          SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // 🪄 Profile Header
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: const LinearGradient(
                      colors: [Color(0xffe6e9ff), Color(0xffffffff)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.25),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      const CircleAvatar(
                        radius: 36,
                        backgroundImage: NetworkImage(
                          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=compress&cs=tinysrgb&w=600",
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Vaibhav Joshi",
                              style: GoogleFonts.dmSans(
                                color: const Color(0xff1f1f3a),
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              "Born: 07 Sept 2002, 09:35 AM\nIndore, India",
                              style: GoogleFonts.dmSans(
                                color: Colors.grey[700],
                                fontSize: 14,
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 26),

                // ♈ Zodiac Wheel Section
                Container(
                  height: 230,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: Colors.grey.shade200),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.auto_awesome, size: 50, color: Colors.indigo.shade200),
                        const SizedBox(height: 12),
                        Text(
                          "Zodiac Wheel Visualization",
                          style: GoogleFonts.dmSans(
                            color: Colors.grey[600],
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // 🌙 Planetary Positions Header
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Planetary Positions",
                    style: GoogleFonts.dmSans(
                      color: const Color(0xff1f1f3a),
                      fontWeight: FontWeight.w700,
                      fontSize: 18,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // 🪐 Planet List
                Column(
                  children: planetData.map((planet) {
                    return Container(
                      margin: const EdgeInsets.symmetric(vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.grey.shade200),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.06),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [Color(0xff4a4aff), Color(0xff7575ff)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: Icon(planet["icon"], color: Colors.white, size: 22),
                        ),
                        title: Text(
                          planet["planet"],
                          style: GoogleFonts.dmSans(
                            color: const Color(0xff1f1f3a),
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                        subtitle: Text(
                          "${planet["sign"]} — ${planet["degree"]}",
                          style: GoogleFonts.dmSans(
                            color: Colors.grey[700],
                            fontSize: 13.5,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 40),

                // 🌞 Button to View Detailed Chart
                ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Loading detailed birth chart...")),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff272757),
                    padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 6,
                  ),
                  child: Text(
                    "View Detailed Chart",
                    style: GoogleFonts.dmSans(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: 30),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
