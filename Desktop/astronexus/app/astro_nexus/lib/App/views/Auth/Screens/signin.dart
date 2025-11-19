import 'package:astro_tale/App/views/Auth/Screens/Signup.dart';
import 'package:astro_tale/App/views/Auth/Screens/forgetpassword.dart';
import 'package:astro_tale/App/views/Auth/Screens/termsandconditions.dart';
import 'package:astro_tale/App/views/dash/DashboardScreen.dart';
import 'package:astro_tale/util/images.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SignIn extends StatefulWidget {
  const SignIn({super.key});

  @override
  State<SignIn> createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  bool _obscurePassword = true;
  bool _rememberMe = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 28),

            // Top Image
            Image.asset(
              Images.signin, // Use your login image asset
              width: 330,
              height: 360,
            ),

            // Bottom Container
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.580,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color(0xff272757),
                      Color(0xff4A4A77),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(40),
                    topRight: Radius.circular(40),
                  ),
                ),
                child: Padding(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(height: 11,),
                      // Title
                      Center(
                        child: Text(
                          "Sign In",
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Center(child: Text('Sign In to explore about our app',style: GoogleFonts.dmSans(color: Colors.white.withOpacity(0.8)),)),
                      const SizedBox(height: 24),

                      // Email Field
                      Text(
                        "Email",
                        style: GoogleFonts.dmSans(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const TextField(
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: "Enter a Email..",
                            prefixIcon: Icon(Icons.person),
                            contentPadding:
                            EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Password Field
                      Text(
                        "Password",
                        style: GoogleFonts.dmSans(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: TextField(
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: "Enter a Password..",
                            prefixIcon: const Icon(Icons.key),
                            contentPadding:
                            const EdgeInsets.symmetric(vertical: 14),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_off
                                    : Icons.visibility,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Remember Me & Forgot Password
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Checkbox(
                                value: _rememberMe,
                                activeColor: const Color(0xFFFFC107),
                                onChanged: (value) {
                                  setState(() {
                                    _rememberMe = value!;
                                  });
                                },
                              ),
                              Text(
                                "Remember Me",
                                style: GoogleFonts.dmSans(
                                  color: Colors.white70,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.push(context,MaterialPageRoute(builder: (_){
                                return Forgetpassword();
                              }));
                            },
                            child: Text(
                              "Forgot Password?",
                              style: GoogleFonts.dmSans(
                                color: const Color(0xFFFFC107),
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),

                      // Sign In Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                             Navigator.push(context,MaterialPageRoute(builder: (_){
                               return DashboardScreen();
                             }));
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xff4A4A77),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shadowColor: Colors.black,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),

                            ),
                          ),
                          child: Text(
                            "Sign In",
                            style: GoogleFonts.dmSans(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                            Text('Don’t have an Account ?',style: GoogleFonts.dmSans(color: Colors.white),),
                            TextButton(onPressed: (){
                              Navigator.push(context, MaterialPageRoute(builder: (_){
                                return SignUp();
                              }));
                            }, child: Text('Sign up',style: GoogleFonts.dmSans(fontWeight: FontWeight.bold,color: Color(0xFFFFC107)),))
                        ],
                      ),

                      // Terms and Conditions
                      Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_){
                              return TermsAndConditions();
                            }));
                          },
                          child: Text(
                            "Terms And Conditions",
                            style: GoogleFonts.dmSans(
                              color: const Color(0xFFFFC107),
                              fontSize: 12,
                              decoration: TextDecoration.underline,
                              decorationColor: Color(0xFFFFC107),
                            ),
                          ),
                        ),
                      ),
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
}
