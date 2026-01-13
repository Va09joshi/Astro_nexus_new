import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KundliScreen extends StatefulWidget {
  const KundliScreen({super.key});

  @override
  State<KundliScreen> createState() => _KundliScreenState();
}

class _KundliScreenState extends State<KundliScreen> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController birthDateController = TextEditingController();
  final TextEditingController birthTimeController = TextEditingController();
  final TextEditingController birthPlaceController = TextEditingController();

  String? selectedGender;

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
          "Kundli Generator",
          style: GoogleFonts.dmSans(
            fontWeight: FontWeight.w700,
            color: const Color(0xff1D1442),
          ),
        ),
        centerTitle: true,
      ),

      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xffE9E7FD), Color(0xffDAD8FB), Color(0xffF5F3FF)],
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
                color: Color(0x403B3B98),
              ),
            ),
          ),

          // Main content
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 10),
                  Text(
                    "Create Your Kundli",
                    style: GoogleFonts.dmSans(
                      fontWeight: FontWeight.w700,
                      fontSize: 26,
                      color: const Color(0xff1D1442),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Enter your birth details to generate your personalized Kundli chart.",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.dmSans(
                      fontSize: 14,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Card with details form
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.white.withOpacity(0.75),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        _buildInputField(
                          controller: nameController,
                          label: "Full Name",
                          icon: Icons.person_outline,
                        ),
                        _buildInputField(
                          controller: birthDateController,
                          label: "Date of Birth",
                          icon: Icons.calendar_today_outlined,
                        ),
                        _buildInputField(
                          controller: birthTimeController,
                          label: "Time of Birth",
                          icon: Icons.access_time_outlined,
                        ),
                        _buildInputField(
                          controller: birthPlaceController,
                          label: "Place of Birth",
                          icon: Icons.location_on_outlined,
                        ),
                        const SizedBox(height: 15),

                        // Gender Selection
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _genderChip("Male", Icons.male),
                            const SizedBox(width: 10),
                            _genderChip("Female", Icons.female),
                          ],
                        ),
                        const SizedBox(height: 35),

                        // Generate Kundli button
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff4A4A77),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 60, vertical: 14),
                            elevation: 6,
                          ),
                          onPressed: () {
                            if (nameController.text.isNotEmpty &&
                                birthDateController.text.isNotEmpty &&
                                birthTimeController.text.isNotEmpty &&
                                birthPlaceController.text.isNotEmpty &&
                                selectedGender != null) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    "Kundli generated successfully! 🌟",
                                    style: GoogleFonts.dmSans(),
                                  ),
                                  backgroundColor: const Color(0xff4A4A77),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Center(
                                    child: Text(
                                      "Please fill all details before generating.",
                                      style: GoogleFonts.dmSans(color: Colors.black),
                                    ),
                                  ),
                                  backgroundColor: Colors.white,
                                ),
                              );
                            }
                          },
                          child: Text(
                            "Generate Kundli",
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
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Reusable textfield builder
  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w500),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: const Color(0xff3B3B98)),
          labelText: label,
          labelStyle: GoogleFonts.dmSans(color: Colors.black54),
          filled: true,
          fillColor: Colors.white.withOpacity(0.95),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }

  // Gender chip widget
  Widget _genderChip(String gender, IconData icon) {
    final bool isSelected = selectedGender == gender;
    return GestureDetector(
      onTap: () {
        setState(() => selectedGender = gender);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xff4A4A77) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xff4A4A77) : Colors.grey.shade300,
          ),
          boxShadow: [
            if (isSelected)
              const BoxShadow(
                color: Color(0x403B3B98),
                blurRadius: 10,
                offset: Offset(0, 4),
              ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon,
                size: 18,
                color: isSelected ? Colors.white : const Color(0xff3B3B98)),
            const SizedBox(width: 6),
            Text(
              gender,
              style: GoogleFonts.dmSans(
                color: isSelected ? Colors.white : const Color(0xff1D1442),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
