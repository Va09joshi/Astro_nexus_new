import 'package:astro_tale/App/views/Auth/Screens/termsandconditions.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:astro_tale/util/images.dart';

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  int _currentStep = 0;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _numberController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
  TextEditingController();

  void _nextStep() {
    if (_currentStep < 4) {
      setState(() => _currentStep++);
    } else {
      _submitForm();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  void _submitForm() {
    final name = _nameController.text.trim();
    final number = _numberController.text.trim();
    final email = _emailController.text.trim();
    final pass = _passwordController.text.trim();
    final confirm = _confirmPasswordController.text.trim();

    if (name.isEmpty ||
        number.isEmpty ||
        email.isEmpty ||
        pass.isEmpty ||
        confirm.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill all fields")),
      );
      return;
    }

    if (pass != confirm) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Passwords do not match")),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Account Created Successfully!")),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _inputFieldWithNextButton(
            "Full Name",
            "Enter your full name",
            Icons.person,
            TextInputType.name,
            _nameController);
      case 1:
        return _inputField("Phone Number", "Enter your number", Icons.phone,
            TextInputType.phone, _numberController);
      case 2:
        return _inputField("Email", "yourname@gmail.com", Icons.email,
            TextInputType.emailAddress, _emailController);
      case 3:
        return _passwordField(
            "Password", _passwordController, _obscurePassword, true);
      case 4:
        return _passwordField("Confirm Password", _confirmPasswordController,
            _obscureConfirmPassword, false);
      default:
        return Container();
    }
  }

  Widget _inputFieldWithNextButton(String label, String hint, IconData icon,
      TextInputType type, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 14)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            keyboardType: type,
            controller: controller,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: hint,
              prefixIcon: Icon(icon),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Center(
          child: ElevatedButton(
            onPressed: _nextStep,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xff4A4A77),
              padding:
              const EdgeInsets.symmetric(horizontal: 60, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text("Next",
                style: GoogleFonts.dmSans(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 10),
        Center(
          child: Text(
            'Step ${_currentStep + 1} of 5',
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 13),
          ),
        ),
      ],
    );
  }

  Widget _inputField(String label, String hint, IconData icon,
      TextInputType type, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 14)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(12)),
          child: TextField(
            keyboardType: type,
            controller: controller,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: hint,
              prefixIcon: Icon(icon),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 10),
        Center(
          child: Text(
            'Step ${_currentStep + 1} of 5',
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 13),
          ),
        ),
      ],
    );
  }

  Widget _passwordField(String label, TextEditingController controller,
      bool obscure, bool isPassword) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 14)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(12)),
          child: TextField(
            obscureText: obscure,
            controller: controller,
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: "********",
              prefixIcon: const Icon(Icons.key),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
              suffixIcon: IconButton(
                icon: Icon(
                  obscure ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    if (isPassword) {
                      _obscurePassword = !_obscurePassword;
                    } else {
                      _obscureConfirmPassword = !_obscureConfirmPassword;
                    }
                  });
                },
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        Center(
          child: Text(
            'Step ${_currentStep + 1} of 5',
            style: GoogleFonts.dmSans(color: Colors.white70, fontSize: 13),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 28),
            Image.asset(
              Images.signup,
              width: 330,
              height: 360,
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                width: double.infinity,
                height: MediaQuery.of(context).size.height * 0.58,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xff272757), Color(0xff4A4A77)],
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
                      SizedBox(height: 40,),
                      Center(
                        child: Text(
                          "Sign Up",
                          style: GoogleFonts.dmSans(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Center(child: Text('Sign Up to explore about our app',style: GoogleFonts.dmSans(color: Colors.white.withOpacity(0.8)),)),
                      const SizedBox(height: 40),
                      _buildStepContent(),
                      const SizedBox(height: 10),
                      if (_currentStep > 0)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 170,
                              child: ElevatedButton(
                                onPressed: _previousStep,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white.withOpacity(0.2),
                                  padding:
                                  const EdgeInsets.symmetric(horizontal: 40),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Text("Back",
                                    style: GoogleFonts.dmSans(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold)),
                              ),
                            ),
                            SizedBox(width: 10,),
                            Container(
                              width: 170,
                              child: ElevatedButton(
                                onPressed: _nextStep,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xff4A4A77),
                                  padding:
                                  const EdgeInsets.symmetric(horizontal: 40),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Text(
                                  _currentStep == 4 ? "Submit" : "Next",
                                  style: GoogleFonts.dmSans(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Already have an Account ?',
                              style: GoogleFonts.dmSans(color: Colors.white)),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: Text('Sign in',
                                style: GoogleFonts.dmSans(
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFFFFC107))),
                          )
                        ],
                      ),
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
            )
          ],
        ),
      ),
    );
  }
}
