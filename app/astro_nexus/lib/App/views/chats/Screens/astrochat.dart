import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class AstrologerListScreen extends StatelessWidget {
  const AstrologerListScreen({super.key});

  final List<Map<String, dynamic>> astrologers = const [
    {
      "name": "Vaibhav Joshi",
      "rating": 5,
      "experience": "13 Years",
      "price": "₹75/min",
      "languages": "English, Hindi +1 more",
      "skills": "Life Astrology, Planetary Aspects +2 more",
      "status": "Online",
      "image":
      "https://i.pinimg.com/564x/cc/fd/dc/ccfddcecb229b80b83ee2ee1cc40a176.jpg"
    },
    {
      "name": "Aiden Billowe",
      "rating": 4,
      "experience": "4 Years",
      "price": "₹45/min",
      "languages": "English, Marathi +1 more",
      "skills": "Life Astrology, Planetary Aspects +2 more",
      "status": "Offline",
      "image":
      "https://i.pinimg.com/564x/dc/38/ee/dc38ee7fdd8b3bb8a58b4cb1e3e9b089.jpg"
    },
    {
      "name": "Efffsas Ghila",
      "rating": 5,
      "experience": "7 Years",
      "price": "₹100/min",
      "languages": "English, Marathi",
      "skills": "Life Astrology, Planetary Aspects +1 more",
      "status": "Online",
      "image":
      "https://i.pinimg.com/564x/f0/5b/15/f05b15a2e9c9daee699c4e7c75e37c10.jpg"
    },
    {
      "name": "Joe Doe",
      "rating": 3,
      "experience": "3 Years",
      "price": "₹100/min",
      "languages": "English, Marathi",
      "skills": "Life Astrology, Planetary Aspects +1 more",
      "status": "Online",
      "image":
      "https://i.pinimg.com/564x/f0/5b/15/f05b15a2e9c9daee699c4e7c75e37c10.jpg"
    },
    {
      "name": "Efffsas Ghila",
      "rating": 5,
      "experience": "7 Years",
      "price": "₹100/min",
      "languages": "English, Marathi",
      "skills": "Life Astrology, Planetary Aspects +1 more",
      "status": "Offline",
      "image":
      "https://i.pinimg.com/564x/f0/5b/15/f05b15a2e9c9daee699c4e7c75e37c10.jpg"
    },
    {
      "name": "Vaibhav Joshi",
      "rating": 5,
      "experience": "13 Years",
      "price": "₹75/min",
      "languages": "English, Hindi +1 more",
      "skills": "Life Astrology, Planetary Aspects +2 more",
      "status": "Online",
      "image":
      "https://i.pinimg.com/564x/cc/fd/dc/ccfddcecb229b80b83ee2ee1cc40a176.jpg"
    },

  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xfff4f6fb),

      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: const Color(0xff272757),
        elevation: 0,
        centerTitle: true,
        title: Text(
          "Astrologers Chat",
          style: GoogleFonts.dmSans(
            color: Colors.white,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView.builder(
          itemCount: astrologers.length,
          itemBuilder: (context, index) {
            final astro = astrologers[index];
            final isOnline = astro["status"] == "Online";

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(2, 5),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    // 👤 Profile Network Image
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        astro["image"],
                        height: 70,
                        width: 70,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            Container(
                              height: 70,
                              width: 70,
                              color: Colors.grey.shade200,
                              child: const Icon(Icons.person, size: 30, color: Colors.grey),
                            ),
                      ),
                    ),
                    const SizedBox(width: 14),

                    // 🌟 Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Name & verified badge
                          Row(
                            children: [
                              Text(
                                astro["name"],
                                style: GoogleFonts.dmSans(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: const Color(0xff1D1442),
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Icon(
                                LucideIcons.badgeCheck,
                                color: Colors.green,
                                size: 18,
                              ),
                            ],
                          ),

                          const SizedBox(height: 4),
                          Text(
                            astro["skills"],
                            style: GoogleFonts.dmSans(
                              fontSize: 12,
                              color: Colors.black87,
                            ),
                          ),

                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(LucideIcons.languages,
                                  size: 15, color: Colors.grey),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  astro["languages"],
                                  style: GoogleFonts.dmSans(
                                    fontSize: 12,
                                    color: Colors.black87,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _infoItem(LucideIcons.award, astro["experience"]),
                              _infoItem(LucideIcons.indianRupee, astro["price"]),
                              Text(
                                astro["status"],
                                style: GoogleFonts.dmSans(
                                  color: isOnline ? Colors.green : Colors.red,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ],
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

  Widget _infoItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 15, color: Colors.grey.shade700),
        const SizedBox(width: 4),
        Text(
          text,
          style: GoogleFonts.dmSans(fontSize: 12, color: Colors.black87),
        ),
      ],
    );
  }
}
