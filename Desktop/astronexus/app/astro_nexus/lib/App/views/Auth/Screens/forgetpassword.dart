import 'package:astro_tale/App/views/Auth/Screens/Signup.dart';
import 'package:astro_tale/App/views/Auth/Screens/otpScreen.dart';
import 'package:astro_tale/App/views/Auth/Screens/signin.dart';
import 'package:astro_tale/App/views/Auth/Screens/termsandconditions.dart';
import 'package:astro_tale/util/images.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Forgetpassword extends StatefulWidget {
  const Forgetpassword({super.key});

  @override
  State<Forgetpassword> createState() => _LoginState();
}

class _LoginState extends State<Forgetpassword> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
          child: SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(height: 28,),
                Image.asset(Images.login,width: 330,height: 360,),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    width: double.infinity,
                    height: MediaQuery.of(context).size.height * 0.575, // covers 70% of screen
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(0xff272757),
                          Color(0xff4A4A77),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      // or any color for the bottom container
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(40),
                        topRight: Radius.circular(40),
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children:  [
                        // You can add your login form here
                        Text(
                          "Forget Password",
                          style: GoogleFonts.dmSans(fontSize: 24,fontWeight: FontWeight.bold,color: Colors.white),

                        ),
                        SizedBox(height: 30,),
                        Padding(
                          padding: const EdgeInsets.all(6.0),
                          child: Container(
                            width: 350,

                            padding: EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.white),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                // Image.asset(
                                //   "assets/icons/flag.png",
                                //   width: 2,
                                //   height: 2,
                                //   fit: BoxFit.contain,
                                // ),

                                SizedBox(width: 40),
                                // Country code
                                Text(
                                  '+91',
                                  style: TextStyle(fontSize: 16),
                                ),
                                SizedBox(width: 8),
                                // Divider
                                Container(
                                  height: 24,
                                  width: 1,
                                  color: Colors.grey,
                                ),
                                SizedBox(width: 12),
                                // Phone number input
                                Expanded(
                                  child: TextField(
                                    keyboardType: TextInputType.phone,
                                    decoration: InputDecoration(
                                        border: InputBorder.none,
                                        hintText: 'Enter phone number',
                                        hintStyle: GoogleFonts.dmSans(color: Colors.grey)
                                    ),
                                  ),
                                ),
                              ],
                            ),

                          ),

                        ),
                        SizedBox(height: 15,),
                        Container(
                          width: 350,
                          child: ElevatedButton(
                            onPressed: () {
                              // Action to perform when button is pressed
                              Navigator.push(context,MaterialPageRoute(builder: (_){
                                return OTPVerification();
                              }));
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xff4A4A77), // Button color
                              foregroundColor: Colors.white, // Text color
                              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8), // Rounded corners
                              ),
                              elevation: 5, // Shadow
                            ),
                            child: Text(
                              'Send OTP',
                              style: GoogleFonts.dmSans(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 11,),

                        Row(
                          children: [
                            Expanded(
                              child: Divider(
                                thickness: 0.5,
                                color: Colors.white,
                                indent: 30,
                              ),
                            ),


                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                              child: Text(
                                'or',
                                style: GoogleFonts.dmSans(
                                  color: Colors.white, // adapts to theme
                                ),
                              ),
                            ),

                            Expanded(
                              child: Divider(
                                thickness: 0.5,
                                color: Colors.white,
                                endIndent: 30,// for Light theme
                              ),
                            )

                          ],
                        ),
                        SizedBox(height: 11,),

                        Container(
                          width: 350,

                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.push(context, MaterialPageRoute(builder: (_){
                                return SignIn();
                              }));
                            },
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Colors.white, width: 2), // Border color & width
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12), // Rounded corners
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12), // Button padding
                            ),
                            child:  Text(
                              'Sign Up',
                              style: GoogleFonts.dmSans(
                                color: Colors.white, // Text color
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 50,),
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
                                  color: Color(0xFFFFC107),
                                  fontSize: 12,
                                  decoration: TextDecoration.underline,
                                  decorationColor: Color(0xFFFFC107)

                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        )
    );
  }
}
