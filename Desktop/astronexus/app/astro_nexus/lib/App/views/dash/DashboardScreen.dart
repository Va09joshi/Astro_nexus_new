import 'package:astro_tale/App/views/Home/Screens/HomeScreen.dart';
import 'package:astro_tale/App/views/chats/Screens/astrochat.dart';
import 'package:astro_tale/App/views/options/optionscreen.dart';
import 'package:astro_tale/App/views/profile/Screen/Profile.dart';
import 'package:astro_tale/App/views/videocall/screen/videoScreen.dart' hide ModernProfileScreen;
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:icons_plus/icons_plus.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    Homescreen(),
    AstrologerListScreen(),
   Optionscreen(),
    AstrologerListVideoScreen(),
    ModernProfileScreen()
  ];

  // Only 4 nav icons for bottom nav (center handled separately)
  final List<IconData> _navIcons = [
    LucideIcons.house,
    LucideIcons.messageCircle,
      LucideIcons.video,
    Icons.person_outline_outlined,
  ];

  void _onTabChanged(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 28,
          color: isActive ? Colors.blue[200] : Colors.white54,
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: GoogleFonts.dmSans(
            color: isActive ? Colors.blue[200] : Colors.white54,
            fontSize: 12,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      floatingActionButton: FloatingActionButton(
        onPressed: () => _onTabChanged(2), // center Dash tab
        backgroundColor: Colors.blue[200],
        child: Icon(LucideIcons.layoutDashboard, color: Colors.white, size: 28),
        elevation: 6,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.miniCenterDocked,
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.only(left: 16, right: 16, bottom: 25),
        child: Container(
          decoration: BoxDecoration(
            color: Color(0xFF1E1E50),
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(color: Colors.black38, blurRadius: 10, offset: Offset(0, 5)),
            ],
          ),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,

            children: [
              // Left side nav items
              Row(
                children: [
                  GestureDetector(
                    onTap: () => _onTabChanged(0),
                    child: _buildNavItem(_navIcons[0], 'Home', _selectedIndex == 0),
                  ),
                  SizedBox(width: 40),
                  GestureDetector(
                    onTap: () => _onTabChanged(1),
                    child: _buildNavItem(_navIcons[1], 'Chats', _selectedIndex == 1),
                  ),
                ],
              ),
              // Right side nav items

              SizedBox(width: 80,),
              Row(
                children: [
                  GestureDetector(
                    onTap: () => _onTabChanged(3),
                    child: _buildNavItem(_navIcons[2], 'Video', _selectedIndex == 3),
                  ),
                  SizedBox(width: 40),
                  GestureDetector(
                    onTap: () => _onTabChanged(4),
                    child: _buildNavItem(_navIcons[3], 'Profile', _selectedIndex == 4),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
