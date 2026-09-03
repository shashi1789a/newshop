const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================================
// AUTH MIDDLEWARE
// ======================================================
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // ================= CHECK TOKEN =================
    if (!token) {
      return res.redirect("/auth/login");
    }

    // ================= VERIFY TOKEN =================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ================= FIND USER =================
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect("/auth/login");
    }

    // ================= BLOCKED USER =================
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    // ================= SAVE USER =================
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Auth Error:", error);

    return res.redirect("/auth/login");
  }
};

// ======================================================
// ADMIN AUTH
// ======================================================
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

    // ================= ADMIN CHECK =================
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied Admin Only",
      });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);

    return res.redirect("/admin/login");
  }
};

// ======================================================
// SELLER AUTH
// ======================================================
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

    // ================= SELLER CHECK =================
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

    next();
  } catch (error) {
    console.error("Seller Auth Error:", error);

    return res.redirect("/auth/login");
  }
};

// ======================================================
// OPTIONAL LOGIN CHECK
// ======================================================
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  sellerAuth,
  optionalAuth,
};