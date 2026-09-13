const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    req.user = user;
    req.token = token;

    res.locals.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error);

    return res.redirect("/auth/login");
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/admin/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect("/admin/login");
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied Admin Only",
      });
    }

    req.user = user;
    req.token = token;

    res.locals.user = user;

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);

    return res.redirect("/admin/login");
  }
};

const sellerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (
      user.role !== "seller" &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Seller Access Only",
      });
    }

    req.user = user;
    req.token = token;

    res.locals.user = user;

    next();
  } catch (error) {
    console.error("Seller Auth Error:", error);

    return res.redirect("/auth/login");
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (user) {
      req.user = user;
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }

    next();
  } catch (error) {

    res.locals.user = null;
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  sellerAuth,
  optionalAuth,
};
