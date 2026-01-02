const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.get('/adregister', (req, res) => {
  res.render('adregister');  
});


router.post('/adregister', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send('All fields are required.');
    }
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Admin with this email already exists.');
    }

    
    const newAdmin = new User({
      name,
      email,
      password, 
      role: 'admin'
    });

    await newAdmin.save();
    console.log(`Admin registered: ${email}`);

    res.redirect('/adlogin');
  } catch (err) {
    console.error('Admin Register Error:', err);
    res.status(500).send('Server error');
  }
});


router.get('/adlogin', (req, res) => {
  res.render('adlogin');  
});


router.post('/adlogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(401).send('Invalid credentials.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials.');
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    console.log(`Admin logged in: ${email}`);

    res.redirect('/adminOrders');
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).send('Server error');
  }
});


router.get('/adlogout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/adlogin');
});

module.exports = router;
