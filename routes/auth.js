const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.get('/register', (req, res) => {
    res.render('register', { errors: [], oldInput: {} });
});


router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('register', {
            errors: errors.array(),
            oldInput: { name, email }
        });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).render('register', {
                errors: [{ msg: 'User already exists' }],
                oldInput: { name, email }
            });
        }

        user = new User({ name, email, password });
        await user.save();

        res.redirect('/auth/login');
      
    } catch (error) {
        console.error(error);
        res.status(500).render('register', {
            errors: [{ msg: 'Server error' }],
            oldInput: { name, email }
        });
    }
});


router.get('/login', (req, res) => {
    res.render('login', { errors: [], oldInput: {} });
});


router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('login', {
            errors: errors.array(),
            oldInput: { email }
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).render('login', {
                errors: [{ msg: 'Invalid credentials' }],
                oldInput: { email }
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('login', {
            errors: [{ msg: 'Server error' }],
            oldInput: { email }
        });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});




module.exports = router;
