const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/adregister", (req, res) => {

  res.render("admin/adregister");

});

router.post("/adregister", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      return res
        .status(400)
        .send("All fields required");

    }

    if (
      password !== confirmPassword
    ) {

      return res
        .status(400)
        .send("Passwords do not match");

    }

    const existingAdmin =
      await User.findOne({
        email,
      });

    if (existingAdmin) {

      return res
        .status(400)
        .send("Admin already exists");

    }

    const newAdmin =
      new User({

        name,

        email,

        password,

        role: "admin",

      });

    await newAdmin.save();

    console.log(
      `Admin Registered: ${email}`
    );

    res.redirect("/adlogin");

  } catch (error) {

    console.error(
      "Admin Register Error:",
      error
    );

    res
      .status(500)
      .send("Server Error");

  }

});

router.get("/adlogin", (req, res) => {

  res.render("admin/adlogin");

});

router.post("/adlogin", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {

      return res
        .status(400)
        .send(
          "Email and password required"
        );

    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res
        .status(401)
        .send(
          "Invalid credentials"
        );

    }

    if (
      user.role !== "admin"
    ) {

      return res
        .status(403)
        .send(
          "Access denied"
        );

    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {

      return res
        .status(401)
        .send(
          "Invalid credentials"
        );

    }

    const token = jwt.sign(

      {
        userId: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }

    );

    res.cookie(
      "token",
      token,
      {

        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge:
          24 *
          60 *
          60 *
          1000,

      }
    );

    console.log(
      `Admin logged in: ${email}`
    );

    res.redirect(
      "/admin/dashboard"
    );

  } catch (error) {

    console.error(
      "Admin Login Error:",
      error
    );

    res
      .status(500)
      .send("Server Error");

  }

});

router.get(
  "/adlogout",
  (req, res) => {

    res.clearCookie(
      "token"
    );

    res.redirect(
      "/adlogin"
    );

  }
);

module.exports = router;