import 'dart:async';
import 'package:astro_tale/App/views/Auth/Screens/login.dart';
import 'package:astro_tale/App/views/dash/DashboardScreen.dart';
import 'package:astro_tale/App/views/onboard/Screens/onboarding.dart';
import 'package:astro_tale/util/images.dart';
import 'package:flutter/material.dart';

class Splashscreen extends StatefulWidget {
  const Splashscreen({super.key});

  @override
  State<Splashscreen> createState() => _SplashscreenState();
}

class _SplashscreenState extends State<Splashscreen> {
  @override
  void initState() {
    super.initState();

    // Navigate to Login screen after 3 seconds
    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => OnboardingScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xff211832),
      body: Center(
        child: Image.asset(
          Images.astronexus, // your foreground image
          width: 200, // optional: adjust size
          height: 200,
        ),
      ),
    );

  }
}
