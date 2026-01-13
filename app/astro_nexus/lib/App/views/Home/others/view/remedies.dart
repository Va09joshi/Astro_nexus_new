import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RemediesScreen extends StatelessWidget {
  const RemediesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> remedies = [
      {
        "title": "Chanting Mantra",
        "desc":
        "Recite ‘Om Namah Shivaya’ 108 times daily to balance planetary energies and promote peace of mind.",
        "icon": Icons.self_improvement,
        "gradient": [const Color(0xff4a3bff), const Color(0xff6a5eff)]
      },
      {
        "title": "Donate on Saturday",
        "desc":
        "Offer black sesame seeds and clothes to those in need to appease Saturn and reduce its malefic effects.",
        "icon": Icons.volunteer_activism,
        "gradient": [const Color(0xff44337a), const Color(0xff5e4b9b)]
      },
      {
        "title": "Meditation & Fasting",
        "desc":
        "Fast once a week and meditate on your ruling planet to align inner energy with the cosmic rhythm.",
        "icon": Icons.brightness_7,
        "gradient": [const Color(0xff1e8ef7), const Color(0xff6ec5ff)]
      },
      {
        "title": "Gemstone Therapy",
        "desc":
        "Wear a Yellow Sapphire (Pukhraj) on Thursday morning to attract wisdom, prosperity, and clarity.",
        "icon": Icons.diamond,
        "gradient": [const Color(0xfff7b733), const Color(0xffffcc33)]
      },
      {
        "title": "Lighting a Lamp",
        "desc":
        "Light a ghee lamp every morning in the east direction to invite positivity and spiritual growth.",
        "icon": Icons.light_mode,
        "gradient": [const Color(0xfff99f4c), const Color(0xffffc67f)]
      },
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          "Astro Remedies",
          style: GoogleFonts.dmSans(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: const Color(0xff1a1a2e),
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: Stack(
        children: [
          // 🌙 Soft Background Circles
          Positioned(
            top: -60,
            left: -40,
            child: Container(
              height: 200,
              width: 200,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x33a8a8ff),
              ),
            ),
          ),
          Positioned(
            bottom: 80,
            right: -40,
            child: Container(
              height: 160,
              width: 160,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x33ffd580),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -30,
            child: Container(
              height: 150,
              width: 150,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x22a8a8ff),
              ),
            ),
          ),

          // 🌟 Foreground Content
          SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Header
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xff1f1f3a), Color(0xff2a2a4a)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Personalized Remedies",
                        style: GoogleFonts.dmSans(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "Balance your planets and enhance positivity with these astrological remedies crafted for you.",
                        style: GoogleFonts.dmSans(
                          color: Colors.white70,
                          fontSize: 14,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Recommended Remedies",
                    style: GoogleFonts.dmSans(
                      color: const Color(0xff1a1a2e),
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Remedy Cards
                Column(
                  children: remedies.map((item) {
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: LinearGradient(
                          colors: item["gradient"],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: item["gradient"][1].withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(
                            color: Colors.white24,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            item["icon"],
                            color: Colors.white,
                            size: 26,
                          ),
                        ),
                        title: Text(
                          item["title"],
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 6),
                          child: Text(
                            item["desc"],
                            style: GoogleFonts.dmSans(
                              color: Colors.white70,
                              fontSize: 13,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
