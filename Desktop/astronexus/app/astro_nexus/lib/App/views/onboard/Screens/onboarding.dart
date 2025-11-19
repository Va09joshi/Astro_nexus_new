import 'package:astro_tale/App/views/Auth/Screens/login.dart';
import 'package:astro_tale/util/images.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _onboardData = [
    {
      "title": "Welcome to AstroNexus",
      "desc":
      "Unlock the mysteries of your stars and understand how the universe shapes your journey. Whether you’re a beginner or a seasoned believer, AstroNexus helps you explore your zodiac, horoscope, and destiny with clarity.",
      "image": Images.onboard1,
    },
    {
      "title": "Get Personalized Predictions",
      "desc":
      "Receive daily, weekly, and yearly predictions crafted just for you. Our AI-powered astrology combines Vedic knowledge and modern data science to deliver accurate insights about your career, love, and destiny.",
      "image": Images.onboard2,
    },
    {
      "title": "Daily Celestial Guidance",
      "desc":
      "Receive accurate horoscope predictions for love, career, and well-being. Wake up every morning with cosmic advice made just for you.",
      "image": Images.onboard3,
    },
    {
      "title": "Begin Your Cosmic Journey",
      "desc":
      "Join thousands of seekers who find clarity, love, and balance through the wisdom of astrology. Let’s begin your cosmic story today.",
      "image": Images.onboard4,
    },
  ];

  void _nextPage() {
    if (_currentPage < _onboardData.length - 1) {
      _controller.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  void _goTologin() {
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => Login()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _onboardData.length,
                onPageChanged: (value) {
                  setState(() {
                    _currentPage = value;
                  });
                },
                itemBuilder: (context, index) => Padding(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                  child: Column(
                    children: [
                      // Top decorative arc
                      // Align(
                      //   alignment: Alignment.topLeft,
                      //   child: Container(
                      //     width: 100,
                      //     height: 80,
                      //     decoration: const BoxDecoration(
                      //       color: Color(0xffe6e6f0),
                      //       borderRadius: BorderRadius.only(
                      //         bottomRight: Radius.circular(100),
                      //       ),
                      //     ),
                      //   ),
                      // ),
                      const SizedBox(height: 50),

                      Image.asset(
                        _onboardData[index]['image']!,
                        height: 348,
                      ),
                      const SizedBox(height: 30),

                      Text(
                        _onboardData[index]['title']!,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.dmSans(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xff1a1446),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        _onboardData[index]['desc']!,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.dmSans(
                          fontSize: 14,
                          height: 1.6,
                          color: Colors.grey[700],
                        ),
                      ),

                      if (index == _onboardData.length - 1) ...[
                        const SizedBox(height: 40),
                        AnimatedOpacity(
                          opacity:
                          _currentPage == _onboardData.length - 1 ? 1.0 : 0,
                          duration: const Duration(milliseconds: 500),
                          child: ElevatedButton(
                            onPressed: _goTologin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                                side: const BorderSide(
                                  color: Color(0xff1a1446),
                                  width: 1,
                                ),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 14,
                              ),
                            ),
                            child: Text(
                              "Get Started →",
                              style: GoogleFonts.dmSans(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xff1a1446),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Navigation (Skip / Dots / Next)
            if (_currentPage != _onboardData.length - 1)
              Padding(
                padding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: _goTologin,
                      child: Text(
                        "Skip",
                        style: GoogleFonts.dmSans(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ),
                    SmoothPageIndicator(
                      controller: _controller,
                      count: _onboardData.length,
                      effect: const ExpandingDotsEffect(
                        dotHeight: 6,
                        dotWidth: 6,
                        activeDotColor: Color(0xff1a1446),
                        dotColor: Color(0xffd6d6d6),
                        spacing: 6,
                        expansionFactor: 3,
                      ),
                    ),
                    TextButton(
                      onPressed: _nextPage,
                      child: Text(
                        "Next",
                        style: GoogleFonts.dmSans(
                          color: const Color(0xff1a1446),
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
