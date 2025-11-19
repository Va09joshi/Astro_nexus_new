import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MatchingScreen extends StatefulWidget {
  const MatchingScreen({super.key});

  @override
  State<MatchingScreen> createState() => _MatchingScreenState();
}

class _MatchingScreenState extends State<MatchingScreen> {
  final TextEditingController maleName = TextEditingController();
  final TextEditingController femaleName = TextEditingController();

  String result = "";
  bool isLoading = false;

  void _checkCompatibility() {
    if (maleName.text.isEmpty || femaleName.text.isEmpty) {
      setState(() {
        result = "Please enter both names 💫";
      });
      return;
    }

    setState(() {
      isLoading = true;
      result = "";
    });

    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        isLoading = false;
        result =
        "${maleName.text} ❤️ ${femaleName.text}\nYour stars align beautifully ✨\nThis connection holds deep cosmic energy!";
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          "Love Compatibility",
          style: GoogleFonts.dmSans(
            color: const Color(0xff1D1442),
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xff3B3B98)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Stack(
        children: [
          // Gradient background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xffF5F3FF), Color(0xffE9E7FD)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),

          // Decorative glowing circles
          Positioned(
            top: -80,
            left: -50,
            child: Container(
              width: 200,
              height: 200,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x403B3B98),
              ),
            ),
          ),
          Positioned(
            bottom: -60,
            right: -40,
            child: Container(
              width: 160,
              height: 160,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x40E84393),
              ),
            ),
          ),

          // Content
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 15),
                  Text(
                    "Find your Astrological Match",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.dmSans(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xff1D1442),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Enter both names to see how your cosmic energies align.",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.dmSans(
                      fontSize: 14,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Input Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.white.withOpacity(0.9),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.25),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        _buildInputField(
                          label: "Male Name",
                          icon: Icons.male_rounded,
                          controller: maleName,
                          color: const Color(0xff3B3B98),
                        ),
                        const SizedBox(height: 20),
                        _buildInputField(
                          label: "Female Name",
                          icon: Icons.female_rounded,
                          controller: femaleName,
                          color: const Color(0xffE84393),
                        ),
                        const SizedBox(height: 30),
                        ElevatedButton(
                          onPressed: isLoading ? null : _checkCompatibility,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff4A4A77),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            elevation: 6,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 60, vertical: 14),
                          ),
                          child: isLoading
                              ? const SizedBox(
                            height: 22,
                            width: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                              : Text(
                            "Check Compatibility",
                            style: GoogleFonts.dmSans(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  // Result Card
                  if (result.isNotEmpty)
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 600),
                      curve: Curves.easeInOut,
                      padding: const EdgeInsets.all(22),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        gradient: const LinearGradient(
                          colors: [Colors.white, Colors.white],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xff4A4A77).withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Text(
                        result,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.dmSans(
                          color: Colors.black,
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                          height: 1.6,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required IconData icon,
    required TextEditingController controller,
    required Color color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        style: GoogleFonts.dmSans(
          fontSize: 15.5,
          color: Colors.black87,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: color),
          hintText: label,
          hintStyle: GoogleFonts.dmSans(
            color: Colors.grey.shade500,
            fontWeight: FontWeight.w400,
          ),
          border: InputBorder.none,
          contentPadding:
          const EdgeInsets.symmetric(horizontal: 15, vertical: 16),
        ),
      ),
    );
  }
}
