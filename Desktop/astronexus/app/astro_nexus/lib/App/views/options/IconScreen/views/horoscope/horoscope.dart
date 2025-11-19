import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HoroscopeScreen extends StatefulWidget {
  const HoroscopeScreen({super.key});

  @override
  State<HoroscopeScreen> createState() => _HoroscopeScreenState();
}

class _HoroscopeScreenState extends State<HoroscopeScreen> {
  String? selectedSign;

  void _showHoroscope(String sign) {
    setState(() => selectedSign = sign);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AnimatedPadding(
        duration: const Duration(milliseconds: 400),
        padding: const EdgeInsets.only(top: 40),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius:
            const BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 25,
                offset: const Offset(0, -5),
              ),
            ],
          ),
          padding: const EdgeInsets.all(25),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                height: 5,
                width: 45,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                "$sign Horoscope",
                style: GoogleFonts.dmSans(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xff1D1442),
                ),
              ),
              const SizedBox(height: 14),
              Text(
                "✨ Today brings a wave of positivity and focus. Trust your instincts and take small, meaningful steps toward your goals. "
                    "The universe favors persistence and clarity today.",
                textAlign: TextAlign.center,
                style: GoogleFonts.dmSans(
                  fontSize: 15,
                  height: 1.5,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff3B3B98),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 60, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => Navigator.pop(context),
                child: Text(
                  "Close",
                  style: GoogleFonts.dmSans(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 15),
                ),
              ),
              const SizedBox(height: 15),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      extendBodyBehindAppBar: true,

      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xff3B3B98)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Daily horoscope",
          style: GoogleFonts.dmSans(
            fontWeight: FontWeight.w700,
            color: const Color(0xff1D1442),
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // Background Circles 🌞
          Positioned(
            top: -80,
            left: -60,
            child: Container(
              height: 220,
              width: 220,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x403B3B98)
              ),
            ),
          ),
          Positioned(
            bottom: -120,
            right: -100,
            child: Container(
              height: 300,
              width: 300,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x403B3B98)
              ),
            ),
          ),

          // Main Content
          Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 100),
                Text(
                  "Choose your zodiac sign to view your daily guidance 🌟",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.dmSans(
                    fontSize: 15,
                    color: Colors.black87,
                    height: 1.5,
                  ),
                ),

                // Zodiac Grid
                Expanded(
                  child: GridView.builder(
                    itemCount: zodiacSigns.length,
                    gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 18,
                      mainAxisSpacing: 18,
                    ),
                    itemBuilder: (context, index) {
                      final sign = zodiacSigns[index];
                      final gradient =
                      zodiacGradients[index % zodiacGradients.length];
                      return GestureDetector(
                        onTap: () => _showHoroscope(sign),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: gradient,
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: gradient.last.withOpacity(0.3),
                                blurRadius: 10,
                                offset: const Offset(3, 5),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              sign,
                              style: GoogleFonts.dmSans(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

final List<String> zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

final List<List<Color>> zodiacGradients = [
  [const Color(0xff8E2DE2), const Color(0xff4A00E0)],
  [const Color(0xffF7971E), const Color(0xffFFD200)],
  [const Color(0xff00B4DB), const Color(0xff0083B0)],
  [const Color(0xffFF6B6B), const Color(0xffF06595)],
  [const Color(0xff6A11CB), const Color(0xff2575FC)],
  [const Color(0xff43C6AC), const Color(0xff191654)],
  [const Color(0xffFDC830), const Color(0xffF37335)],
  [const Color(0xffC6FFDD), const Color(0xffFBD786)],
  [const Color(0xff8E0E00), const Color(0xff1F1C18)],
  [const Color(0xff3E5151), const Color(0xffDECBA4)],
  [const Color(0xff8360c3), const Color(0xff2ebf91)],
  [const Color(0xffFF416C), const Color(0xffFF4B2B)],
];
