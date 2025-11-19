import 'dart:async';
import 'package:astro_tale/App/views/Home/others/view/birthchart.dart';
import 'package:astro_tale/App/views/Home/others/view/remedies.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/horoscope/horoscope.dart';
import 'package:astro_tale/App/views/options/IconScreen/views/match/matching.dart';
import 'package:astro_tale/util/images.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Homescreen extends StatefulWidget {
  const Homescreen({super.key});

  @override
  State<Homescreen> createState() => _HomescreenState();
}

class _HomescreenState extends State<Homescreen> {
  final PageController _bannerController = PageController();
  int _currentBanner = 0;

  final List<String> bannerImages = [
    Images.banner_one,
    Images.banner_two,
    Images.banner_three,
  ];

  final TextEditingController _searchController = TextEditingController();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    // Auto-slide banner every 4 seconds
    Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_currentBanner < bannerImages.length - 1) {
        _currentBanner++;
      } else {
        _currentBanner = 0;
      }
      _bannerController.animateToPage(
        _currentBanner,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 🌟 Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 26,
                        backgroundImage: AssetImage('assets/avatar.png'),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Welcome, Alex ★',
                        style: GoogleFonts.dmSans(
                          color: Colors.black87,
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const Icon(Icons.notifications_outlined,
                      color: Colors.black87, size: 28),
                ],
              ),

              const SizedBox(height: 18),

              // 🔍 Modern Search Bar
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.deepPurpleAccent.withOpacity(0.08),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    )
                  ],
                  border: Border.all(
                    color: _isFocused
                        ? Color(0xff272757)
                        : Colors.grey.shade300,
                    width: 1.2,
                  ),
                ),
                child: Row(
                  children: [
                    const SizedBox(width: 12),
                    const Icon(Icons.search, color: Color(0xff272757)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Focus(
                        onFocusChange: (hasFocus) {
                          setState(() {
                            _isFocused = hasFocus;
                          });
                        },
                        child: TextField(
                          controller: _searchController,
                          cursorColor: Colors.deepPurpleAccent,
                          style: GoogleFonts.dmSans(
                              color: Colors.black87, fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'Search horoscopes, zodiac, or tools...',
                            hintStyle: GoogleFonts.dmSans(
                                color: Colors.black54, fontSize: 14),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    if (_searchController.text.isNotEmpty)
                      IconButton(
                        icon: const Icon(Icons.close,
                            color: Colors.deepPurpleAccent),
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                          });
                        },
                      ),
                    const SizedBox(width: 8),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 🌈 Image Banner with PageView
              Container(
                height: 180,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.deepPurpleAccent.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 6))
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(18),
                  child: Stack(
                    children: [
                      PageView.builder(
                        controller: _bannerController,
                        itemCount: bannerImages.length,
                        onPageChanged: (index) {
                          setState(() {
                            _currentBanner = index;
                          });
                        },
                        itemBuilder: (context, index) {
                          return Image.asset(
                            bannerImages[index],
                            fit: BoxFit.cover,
                            width: double.infinity,
                          );
                        },
                      ),
                      // Gradient overlay
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.black.withOpacity(0.3),
                              Colors.transparent
                            ],
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                          ),
                        ),
                      ),
                      // Page indicator
                      Positioned(
                        bottom: 10,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(
                            bannerImages.length,
                                (index) => AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              margin:
                              const EdgeInsets.symmetric(horizontal: 4),
                              height: 6,
                              width: _currentBanner == index ? 18 : 8,
                              decoration: BoxDecoration(
                                color: _currentBanner == index
                                    ? Color(0xffFFB900)
                                    : Colors.white70,
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 25),

              // 🔮 Today's Horoscope
              _modernCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Today's Horoscope",
                        style: GoogleFonts.dmSans(
                            color: Colors.black87,
                            fontWeight: FontWeight.bold,
                            fontSize: 18)),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Icon(Icons.auto_awesome,
                            color: Color(0xff272757)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'A positive day ahead — your intuition is strong and opportunities are aligning.',
                            style: GoogleFonts.dmSans(
                                color: Colors.black54, fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _smallTag("Lucky Number: 9"),
                        _smallTag("Color: Indigo"),
                        _smallTag("Time: 3 PM"),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 25),

              // 🌙 Daily Highlights
              Text("Daily Highlights",
                  style: GoogleFonts.dmSans(
                      color: Colors.black87,
                      fontWeight: FontWeight.bold,
                      fontSize: 17)),
              const SizedBox(height: 15),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildCircleIcon(context, Icons.wb_sunny_outlined, "Horoscope", HoroscopeScreen()),
                  _buildCircleIcon(context, Icons.favorite_outline, "Matchmaking", MatchingScreen()),
                  _buildCircleIcon(context, Icons.brightness_3_outlined, "Birth Chart", BirthChartScreen()),
                  _buildCircleIcon(context, Icons.healing_outlined, "Remedies", RemediesScreen()),
                ],
              ),

              const SizedBox(height: 25),

              // 🤖 AI Section
              Text("AI Section",
                  style: GoogleFonts.dmSans(
                      color: Colors.black87,
                      fontWeight: FontWeight.bold,
                      fontSize: 17)),
              const SizedBox(height: 12),
              _modernCard(
                child: Row(
                  children: [
                    const Icon(Icons.chat_bubble_outline,
                        color: Color(0xff412B6B), size: 28),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Ask AstroNexus AI anything about your zodiac or destiny!',
                        style: GoogleFonts.dmSans(
                            color: Colors.black54, fontSize: 14),
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios,
                        color: Colors.deepPurpleAccent, size: 16)
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // ⚙️ Astro Tools
              Text("Astro Tools",
                  style: GoogleFonts.dmSans(
                      color: Colors.black87,
                      fontWeight: FontWeight.bold,
                      fontSize: 17)),
              const SizedBox(height: 15),
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 2,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 15,
                mainAxisSpacing: 15,
                childAspectRatio: 1.4,
                children: [
                  _buildToolCard(Icons.public, "Birth Chart"),
                  _buildToolCard(Icons.calculate, "Numerology"),
                  _buildToolCard(Icons.people_alt_outlined, "Compatibility"),
                  _buildToolCard(Icons.self_improvement, "Meditation"),
                ],
              ),
              const SizedBox(height: 25),
            ],
          ),
        ),
      ),
    );
  }

  // 🌈 Reusable UI Components
  Widget _modernCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
              color: Colors.deepPurpleAccent.withOpacity(0.1),
              blurRadius: 15,
              spreadRadius: 3,
              offset: const Offset(0, 8))
        ],
      ),
      child: child,
    );
  }

  Widget _buildCircleIcon(
      BuildContext context, IconData icon, String label, Widget screen) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => screen),
        );
      },
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xff272757), Color(0xff4A4A77)],
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 6,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 26),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.dmSans(
              color: Colors.black87,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }



  Widget _smallTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.deepPurpleAccent.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(text,
          style: GoogleFonts.dmSans(color: Colors.deepPurple, fontSize: 12)),
    );
  }

  Widget _buildToolCard(IconData icon, String title) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: Color(0xffA7AAE1).withOpacity(0.2),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Color(0xff272757).withOpacity(0.90), size: 32),
          const SizedBox(height: 8),
          Text(title,
              style: GoogleFonts.dmSans(color: Colors.black87, fontSize: 13)),
        ],
      ),
    );
  }
}
