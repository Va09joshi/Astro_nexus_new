import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class AstrologerListVideoScreen extends StatelessWidget {
  const AstrologerListVideoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dmsans = GoogleFonts.dmSans();

    final List<Map<String, dynamic>> astrologers = [
      {
        "name": "Vaibhav Joshi",
        "rating": 4.9,
        "experience": "12 Years",
        "price": "₹75 / min",
        "image":
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        "about":
        "Expert in Vedic astrology, specializing in career and relationship compatibility.",
      },
      {
        "name": "Ananya Sharma",
        "rating": 4.8,
        "experience": "9 Years",
        "price": "₹65 / min",
        "image":
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        "about":
        "Specialist in Tarot readings and personalized future predictions.",
      },
      {
        "name": "Rohan Mehta",
        "rating": 5.0,
        "experience": "15 Years",
        "price": "₹85 / min",
        "image":
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        "about":
        "Renowned astrologer guiding people on wealth, marriage, and success paths.",
      },
      {
        "name": "Kavya Patel",
        "rating": 4.7,
        "experience": "8 Years",
        "price": "₹60 / min",
        "image":
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
        "about":
        "Expert in numerology, love astrology, and career path consultation.",
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xfff4f6fb),
      appBar: AppBar(

        title: Center(
          child: Text(
            "Astrologers Video chat",
            style: dmsans.copyWith(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),

          ),
        ),
        automaticallyImplyLeading: false,
        backgroundColor: Color(0xff272757),
        elevation: 1,

      ),

      // ✅ No bottom navigation
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: astrologers.length,
          itemBuilder: (context, index) {
            final astro = astrologers[index];

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 👤 Astrologer Image
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        astro["image"],
                        width: 85,
                        height: 85,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 16),

                    // 🪔 Info
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            astro["name"],
                            style: dmsans.copyWith(
                              fontSize: 17,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.star, color: Colors.amber, size: 18),
                              const SizedBox(width: 4),
                              Text(
                                "${astro["rating"]} • ${astro["experience"]}",
                                style: dmsans.copyWith(
                                  color: Colors.black54,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            astro["price"],
                            style: dmsans.copyWith(
                              color: Colors.green.shade700,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            astro["about"],
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: dmsans.copyWith(
                              color: Colors.black87,
                              fontSize: 13,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // 🎥 Video Call Button
                    InkWell(
                      onTap: () {
                        // TODO: Navigate to video call screen
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              "Starting video call with ${astro["name"]}...",
                              style: dmsans.copyWith(color: Colors.white),
                            ),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xff5b3dfa), Color(0xff3725e8)],
                          ),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          LucideIcons.video,
                          color: Colors.white,
                          size: 22,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
