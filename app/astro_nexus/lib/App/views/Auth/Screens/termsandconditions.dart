import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TermsAndConditions extends StatelessWidget {
  const TermsAndConditions({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff272757),
      appBar: AppBar(
        backgroundColor: const Color(0xff4A4A77),
        elevation: 0,
        centerTitle: true,
        title: Text(
          "Terms & Conditions",
          style: GoogleFonts.dmSans(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),

      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xff272757),
              Color(0xff4A4A77),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                  "Welcome to AstroNexus!",
                  style: GoogleFonts.dmSans(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  "By using our application, you agree to the following Terms and Conditions. "
                      "Please read them carefully before proceeding.",
                  style: GoogleFonts.dmSans(
                    color: Colors.white70,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              _sectionTitle("1. Acceptance of Terms"),
              _sectionText(
                "By creating an account or using our services, you agree to comply with and be bound "
                    "by these Terms and Conditions. If you do not agree, please discontinue using the app immediately.",
              ),

              _sectionTitle("2. User Responsibilities"),
              _sectionText(
                "You agree to use the app only for lawful purposes and in a manner that does not infringe "
                    "the rights of, or restrict or inhibit anyone else’s use and enjoyment of the app.",
              ),

              _sectionTitle("3. Account Security"),
              _sectionText(
                "You are responsible for maintaining the confidentiality of your login information and "
                    "for all activities that occur under your account.",
              ),

              _sectionTitle("4. Privacy Policy"),
              _sectionText(
                "We value your privacy. Your personal information will be handled according to our Privacy Policy. "
                    "We do not share your data with third parties without consent.",
              ),

              _sectionTitle("5. Limitation of Liability"),
              _sectionText(
                "We are not responsible for any direct, indirect, or incidental damages resulting from the use of our app, "
                    "including but not limited to data loss or service interruption.",
              ),

              _sectionTitle("6. Updates to Terms"),
              _sectionText(
                "We may modify these Terms and Conditions at any time. Continued use of the app implies acceptance of the revised terms.",
              ),

              const SizedBox(height: 30),
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xff4A4A77),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 40, vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text(
                    "I Agree",
                    style: GoogleFonts.dmSans(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Helper widgets for consistent styling
  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6, top: 16),
      child: Text(
        title,
        style: GoogleFonts.dmSans(
          color: const Color(0xFFFFC107),
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _sectionText(String text) {
    return Text(
      text,
      style: GoogleFonts.dmSans(
        color: Colors.white70,
        fontSize: 14,
        height: 1.5,
      ),
    );
  }
}
