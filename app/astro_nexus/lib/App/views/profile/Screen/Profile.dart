import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ModernProfileScreen extends StatefulWidget {
  const ModernProfileScreen({super.key});

  @override
  State<ModernProfileScreen> createState() => _ModernProfileScreenState();
}

class _ModernProfileScreenState extends State<ModernProfileScreen> {
  final TextEditingController nameController = TextEditingController(text: "Vaibhav Joshi");
  final TextEditingController emailController = TextEditingController(text: "vaibhavjoshi0709@gmail.com");
  final TextEditingController phoneController = TextEditingController(text: "7898030562");
  final TextEditingController passwordController = TextEditingController(text: "12345**");

  @override
  Widget build(BuildContext context) {
    final Color bgColor = const Color(0xff0b132b);
    final Color accentColor = const Color(0xff5bc0be);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // HEADER SECTION
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 30, bottom: 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xff0b132b), Color(0xff1c2541)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 50,
                    
                    backgroundImage: NetworkImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8tTyrxNMNiUxU5-P1xmNN4FHeVxUZEr1YKg&s'),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    "Vaibhav Joshi",
                    style: GoogleFonts.dmSans(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    "Something short and simple here",
                    style: GoogleFonts.dmSans(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildInfoCard("Rating", "4.9"),
                      _divider(),
                      _buildInfoCard("Experience", "13 yrs"),
                      _divider(),
                      _buildInfoCard("Calls", "350+"),
                    ],
                  ),
                ],
              ),
            ),

            // BODY SECTION
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(20),
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
                ),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: 10),

                      // 🔹 Account Information (new section)
                      _buildAccountInfoTile(accentColor),

                      _buildExpansionTile("FAQ"),
                      _buildExpansionTile("Feedbacks & Support"),
                      _buildExpansionTile("Terms & Conditions"),
                      _buildExpansionTile("Privacy"),
                      _buildExpansionTile("About Us"),
                      _buildExpansionTile("Contact Us"),

                      const SizedBox(height: 30),

                      // Logout Button
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent,
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 30),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        icon: const Icon(Icons.power_settings_new, color: Colors.white),
                        label: Text(
                          "Logout",
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        onPressed: () {},
                      ),

                      const SizedBox(height: 30),

                      // Social Icons
                      Text(
                        "Follow us on",
                        style: GoogleFonts.dmSans(
                          fontSize: 15,
                          color: Colors.black87,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 15),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(FontAwesomeIcons.facebook, color: Color(0xff1877f2), size: 26),
                          SizedBox(width: 20),
                          Icon(FontAwesomeIcons.instagram, color: Color(0xffe1306c), size: 26),
                          SizedBox(width: 20),
                          Icon(FontAwesomeIcons.twitter, color: Color(0xff1da1f2), size: 26),
                          SizedBox(width: 20),
                          Icon(FontAwesomeIcons.pinterest, color: Color(0xffe60023), size: 26),
                        ],
                      ),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 🔸 Account Info Section
  Widget _buildAccountInfoTile(Color accentColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black12.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(1, 2),
            ),
          ],
        ),
        child: ExpansionTile(
          iconColor: accentColor,
          collapsedIconColor: accentColor,
          title: Text(
            "Account Information",
            style: GoogleFonts.dmSans(
              fontWeight: FontWeight.w600,
              color: Colors.black87,
              fontSize: 15,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextField("Full Name", nameController),
                  const SizedBox(height: 12),
                  _buildTextField("Email", emailController),
                  const SizedBox(height: 12),
                  _buildTextField("Phone", phoneController),
                  const SizedBox(height: 12),
                  _buildTextField('password', passwordController),
                  SizedBox(height: 18,),
                  Center(
                    child: Container(
                      width: 200,
                      child: ElevatedButton(

                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xff272757),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                "Profile Updated Successfully!",
                                style: GoogleFonts.dmSans(color: Colors.white),
                              ),
                              backgroundColor: Color(0xff412B6B),
                            ),
                          );
                        },
                        child: Text(
                          "Update Info",
                          style: GoogleFonts.dmSans(
                            fontSize: 15,
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
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

  // Helper: TextField
  Widget _buildTextField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      style: GoogleFonts.dmSans(fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.dmSans(fontSize: 13, color: Colors.black54),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: Color(0xff5bc0be)),
        ),
      ),
    );
  }

  // Helper Widgets
  Widget _divider() {
    return Container(
      width: 1,
      height: 30,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      color: Colors.white24,
    );
  }

  Widget _buildInfoCard(String title, String value) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.dmSans(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: GoogleFonts.dmSans(
            color: Colors.white70,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildExpansionTile(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black12.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(1, 2),
            ),
          ],
        ),
        child: ExpansionTile(
          iconColor: const Color(0xff5bc0be),
          collapsedIconColor: const Color(0xff5bc0be),
          title: Text(
            title,
            style: GoogleFonts.dmSans(
              fontWeight: FontWeight.w600,
              color: Colors.black87,
              fontSize: 15,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                "Details about $title will appear here.",
                style: GoogleFonts.dmSans(fontSize: 14, color: Colors.black54),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
