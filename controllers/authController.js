
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

exports.signup = async (req, res) => {
  try {
    const { name, email, password, location, experience, skills, preferredJobType } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      experience,
      skills,
      preferredJobType
    });

    await user.save();
    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Login successful", token, user });

  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
