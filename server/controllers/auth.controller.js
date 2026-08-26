const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("UPDATE ME ERROR:", error); res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // We need to explicitly select the password because it was set to select: false in the schema
    const user = await User.findOne({ email }).select('+password');

        if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("UPDATE ME ERROR:", error); res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is already populated by the protect middleware
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("UPDATE ME ERROR:", error); res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};


// @desc    Update user profile
// @route   PUT /api/v1/auth/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
       return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
       user.password = req.body.password;
    }
    if (req.file) {
      user.avatarUrl = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl,
      token: generateToken(updatedUser._id) // issue new token just in case
    });
  } catch (error) {
    console.error("UPDATE ME ERROR:", error); res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

module.exports = { registerUser, authUser, getMe, updateMe };





