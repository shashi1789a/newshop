const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authadmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/adlogin');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') return res.status(403).send('You are not a Admin');

    req.user = user;
    next();
  } catch (err) {
    console.error('Admin Auth Middleware Error:', err);
    res.redirect('/adlogin');
  }
};

module.exports = authadmin;
