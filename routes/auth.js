const express = require("express");

const router = express.Router();

const {
  body,
  validationResult,
} = require("express-validator");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ======================================================
// REGISTER PAGE
// ======================================================

router.get(
  "/register",
  (req, res) => {

    res.render(
      "auth/register",
      {
        errors: [],
        oldInput: {},
      }
    );

  }
);

// ======================================================
// REGISTER USER
// ======================================================

router.post(

  "/register",

  [

    body("name")
      .notEmpty()
      .withMessage(
        "Name is required"
      ),

    body("email")
      .isEmail()
      .withMessage(
        "Please enter valid email"
      ),

    body("password")
      .isLength({
        min: 6,
      })
      .withMessage(
        "Password must be at least 6 characters"
      ),

    body("confirmPassword")
      .custom(
        (
          value,
          { req }
        ) => {

          if (
            value !==
            req.body.password
          ) {

            throw new Error(
              "Passwords do not match"
            );

          }

          return true;

        }
      ),

  ],

  async (
    req,
    res
  ) => {

    const errors =
      validationResult(req);

    const {
      name,
      email,
      password,
    } = req.body;

    // ================= VALIDATION ERROR =================

    if (
      !errors.isEmpty()
    ) {

      return res
        .status(400)
        .render(
          "auth/register",
          {

            errors:
              errors.array(),

            oldInput: {
              name,
              email,
            },

          }
        );

    }

    try {

      // ================= CHECK USER =================

      let user =
        await User.findOne({
          email,
        });

      if (user) {

        return res
          .status(400)
          .render(
            "auth/register",
            {

              errors: [
                {
                  msg:
                    "User already exists",
                },
              ],

              oldInput: {
                name,
                email,
              },

            }
          );

      }

      // ================= CREATE USER =================

      user =
        new User({

          name,

          email,

          password,

          role: "user",

        });

      await user.save();

      console.log(
        `User Registered: ${email}`
      );

      res.redirect(
        "/auth/login"
      );

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .render(
          "auth/register",
          {

            errors: [
              {
                msg:
                  "Server Error",
              },
            ],

            oldInput: {
              name,
              email,
            },

          }
        );

    }

  }
);

// ======================================================
// LOGIN PAGE
// ======================================================

router.get(
  "/login",
  (req, res) => {

    res.render(
      "auth/login",
      {
        errors: [],
        oldInput: {},
      }
    );

  }
);

// ======================================================
// LOGIN USER
// ======================================================

router.post(

  "/login",

  [

    body("email")
      .isEmail()
      .withMessage(
        "Please enter valid email"
      ),

    body("password")
      .notEmpty()
      .withMessage(
        "Password is required"
      ),

  ],

  async (
    req,
    res
  ) => {

    const errors =
      validationResult(req);

    const {
      email,
      password,
    } = req.body;

    // ================= VALIDATION ERROR =================

    if (
      !errors.isEmpty()
    ) {

      return res
        .status(400)
        .render(
          "auth/login",
          {

            errors:
              errors.array(),

            oldInput: {
              email,
            },

          }
        );

    }

    try {

      // ================= FIND USER =================

      const user =
        await User.findOne({
          email,
        });

      // ================= USER NOT FOUND =================

      if (!user) {

        return res
          .status(400)
          .render(
            "auth/login",
            {

              errors: [
                {
                  msg:
                    "Invalid credentials",
                },
              ],

              oldInput: {
                email,
              },

            }
          );

      }

      // ================= PASSWORD CHECK =================

      const isMatch =
        await user.comparePassword(
          password
        );

      if (!isMatch) {

        return res
          .status(400)
          .render(
            "auth/login",
            {

              errors: [
                {
                  msg:
                    "Invalid credentials",
                },
              ],

              oldInput: {
                email,
              },

            }
          );

      }

      // ================= JWT TOKEN =================

      const token =
        jwt.sign(

          {

            userId:
              user._id,

            role:
              user.role,

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "1d",

          }

        );

      // ================= COOKIE =================

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
        `User Logged In: ${email}`
      );

      // ================= REDIRECT =================

      res.redirect("/");

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .render(
          "auth/login",
          {

            errors: [
              {
                msg:
                  "Server Error",
              },
            ],

            oldInput: {
              email,
            },

          }
        );

    }

  }
);

// ======================================================
// LOGOUT USER
// ======================================================

router.get(
  "/logout",
  (req, res) => {

    res.clearCookie(
      "token"
    );

    res.redirect(
      "/auth/login"
    );

  }
);

module.exports = router;