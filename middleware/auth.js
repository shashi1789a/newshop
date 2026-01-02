const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; 

    if (!token) {
      return res.redirect('/auth/login'); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect('/auth/login');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/auth/login');
  }
};


























// Middleware for admin check
// const adminAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.redirect('/login');
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user || user.role !== 'admin') {
//       return res.status(403).send('Access Denied');
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error('Admin Auth error:', error);
//     res.redirect('/Adlogin');
//   }
// };
// module.exports = async function (req, res, next) {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.redirect("/login");
//     }

//     const decoded = jwt.verify(token, "secretkey");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("Auth error:", err);
//     return res.redirect("/login");
//   }
// };

module.exports = { auth };
