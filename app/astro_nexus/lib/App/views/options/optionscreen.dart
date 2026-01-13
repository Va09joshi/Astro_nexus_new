import 'package:astro_tale/App/views/options/IconScreen/views/counseller/counseller_screen.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/horoscope/horoscope.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/kundli/kundliScreen.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/match/matching.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/prediction/prediction_screen.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/store/storeScreen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class Optionscreen extends StatefulWidget {
  const Optionscreen({super.key});

  @override
  State<Optionscreen> createState() => _OptionscreenState();
}

class _OptionscreenState extends State<Optionscreen> {
  final List<Map<String, dynamic>> features = [
    {"title": "Kundli", "icon": LucideIcons.bookOpenCheck, "screen": KundliScreen()},
    {"title": "Predictions", "icon": LucideIcons.sparkles, "screen":PredictionScreen()},
    {"title": "Horoscope", "icon": LucideIcons.sun, "screen": HoroscopeScreen()},
    {"title": "Matching", "icon": LucideIcons.heartHandshake, "screen": MatchingScreen()},
    {"title": "Store", "icon": LucideIcons.shoppingBag, "screen":  StoreScreen()},
    {"title": "Counseler", "icon": LucideIcons.userRound, "screen": CounselorScreen()},
  ];

  final List<Map<String, dynamic>> categories = [
    {"title": "Education", "icon": LucideIcons.graduationCap},
    {"title": "Career", "icon": LucideIcons.briefcaseBusiness},
    {"title": "Love", "icon": LucideIcons.heart},
    {"title": "Muhurat", "icon": LucideIcons.clock},
    {"title": "Health", "icon": LucideIcons.heartPulse},
    {"title": "Mental", "icon": LucideIcons.brain},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white.withOpacity(0.4),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 15),
              Text(
                "Ask Help To AstroNexus 🔮",
                style: GoogleFonts.dmSans(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xff1D1442),
                ),
              ),
              const SizedBox(height: 25),

              // 🔯 Feature Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: features.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 18,
                  crossAxisSpacing: 18,
                  childAspectRatio: 1,
                ),
                itemBuilder: (context, index) {
                  return _buildFeatureCard(
                    icon: features[index]["icon"],
                    title: features[index]["title"],
                    screen: features[index]["screen"],
                  );
                },
              ),

              const SizedBox(height: 30),

              _buildSearchBar(),

              const SizedBox(height: 35),

              // 🌠 Category Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: categories.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 20,
                  crossAxisSpacing: 20,
                  childAspectRatio: 1,
                ),
                itemBuilder: (context, index) {
                  return _buildCategoryCircle(
                    icon: categories[index]["icon"],
                    title: categories[index]["title"],
                  );
                },
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  // ✴️ Feature Card with navigation
  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required Widget screen,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(2, 4),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => screen),
          );
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              height: 45,
              width: 45,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xff272757), Color(0xff4A4A77)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: GoogleFonts.dmSans(
                fontSize: 13,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 🔍 Modern Search Bar
  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.search_rounded, color: Color(0xff6C63FF)),
          const SizedBox(width: 6),
          Expanded(
            child: TextField(
              style: GoogleFonts.dmSans(color: Colors.black87, fontSize: 14),
              decoration: InputDecoration(
                hintText: "Ask Anything...",
                hintStyle:
                GoogleFonts.dmSans(color: Colors.grey.shade500, fontSize: 14),
                border: InputBorder.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 🪐 Category Circle
  Widget _buildCategoryCircle({required IconData icon, required String title}) {
    return Column(
      children: [
        Container(
          height: 70,
          width: 70,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              colors: [Color(0xffE9E7FD), Color(0xffD6D3FA)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.2),
                blurRadius: 8,
                offset: const Offset(2, 4),
              ),
            ],
          ),
          child: Icon(icon, color: const Color(0xff3B3B98), size: 28),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: GoogleFonts.dmSans(
            fontSize: 13,
            color: const Color(0xff1D1442),
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
