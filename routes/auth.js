const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  body,
  validationResult,
} = require("express-validator");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const googleController =
  require("../controllers/google.controller");

router.get(
  "/register",
  (req, res) => {
    res.render("auth/register", {
      errors: [],
      oldInput: {},
    });
  }
);

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(
          "Passwords do not match"
        );
      }

      return true;
    }),

  body("role")
    .isIn(["user", "seller"])
    .withMessage(
      "Please select account type"
    ),

  body("phone")
    .if(body("role").equals("seller"))
    .notEmpty()
    .withMessage(
      "Phone number is required for sellers"
    ),

  body("businessName")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "Business name is required"
    ),

  body("businessType")
    .if(body("role").equals("seller"))
    .isIn([
      "INDIVIDUAL",
      "PROPRIETORSHIP",
      "PARTNERSHIP",
      "PRIVATE_LIMITED",
      "LLP",
    ])
    .withMessage(
      "Please select a valid business type"
    ),

  body("panNumber")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "PAN number is required for sellers"
    ),

  body("pickupStreet")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "Pickup address is required"
    ),

  body("pickupCity")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "City is required"
    ),

  body("pickupState")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "State is required"
    ),

  body("pickupZipCode")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "ZIP code is required"
    ),

  body("accountHolderName")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "Account holder name is required"
    ),

  body("accountNumber")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "Bank account number is required"
    ),

  body("ifscCode")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage(
      "IFSC code is required"
    ),
];

router.post(
  "/register",
  registerValidationRules,
  async (req, res) => {
    const errors = validationResult(req);

    const {
      name,
      email,
      password,
      role,
      phone,
      businessName,
      businessType,
      gstNumber,
      panNumber,
      pickupStreet,
      pickupCity,
      pickupState,
      pickupZipCode,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("auth/register", {
          errors: errors.array(),
          oldInput: req.body,
        });
    }

    try {
      const normalizedEmail =
        email.trim().toLowerCase();

      let user = await User.findOne({
        email: normalizedEmail,
      });

      if (user) {
        return res
          .status(400)
          .render("auth/register", {
            errors: [
              {
                msg: "User already exists",
              },
            ],
            oldInput: req.body,
          });
      }

      const newUserData = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        phone: phone || undefined,
      };

      if (role === "seller") {
        newUserData.sellerDetails = {
          businessName,
          businessType,
          gstNumber:
            gstNumber || undefined,
          panNumber,

          pickupAddress: {
            street: pickupStreet,
            city: pickupCity,
            state: pickupState,
            zipCode: pickupZipCode,
            country: "India",
          },

          payout: {
            accountHolderName,
            bankName:
              bankName || undefined,
            accountNumber,
            ifscCode,
            upiId:
              upiId || undefined,
          },
        };
      }

      user = new User(newUserData);

      await user.save();

      console.log(
        `${
          role === "seller"
            ? "Seller"
            : "User"
        } Registered: ${normalizedEmail}`
      );

      if (role === "seller") {
        return res.render(
          "auth/seller-pending",
          {
            name: user.name,
          }
        );
      }

      return res.redirect(
        "/auth/login"
      );
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      return res
        .status(500)
        .render("auth/register", {
          errors: [
            {
              msg: "Server Error",
            },
          ],
          oldInput: req.body,
        });
    }
  }
);

router.get(
  "/login",
  (req, res) => {
    res.render("auth/login", {
      errors: [],
      oldInput: {},
    });
  }
);

router.post(
  "/login",

  [
    body("email")
      .trim()
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

  async (req, res) => {
    const errors =
      validationResult(req);

    const {
      email,
      password,
    } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("auth/login", {
          errors: errors.array(),
          oldInput: {
            email,
          },
        });
    }

    try {
      const normalizedEmail =
        email.trim().toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return res
          .status(400)
          .render("auth/login", {
            errors: [
              {
                msg:
                  "Invalid credentials",
              },
            ],
            oldInput: {
              email,
            },
          });
      }

      const isMatch =
        await user.comparePassword(
          password
        );

      if (!isMatch) {
        return res
          .status(400)
          .render("auth/login", {
            errors: [
              {
                msg:
                  "Invalid credentials",
              },
            ],
            oldInput: {
              email,
            },
          });
      }

      if (user.isBlocked) {
        return res
          .status(403)
          .render("auth/login", {
            errors: [
              {
                msg:
                  "Your account has been blocked. Contact support.",
              },
            ],
            oldInput: {
              email,
            },
          });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error(
          "JWT_SECRET is not configured"
        );
      }

      const token = jwt.sign(
        {
          userId:
            user._id.toString(),
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const isProduction =
        process.env.NODE_ENV ===
        "production";

      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge:
            24 *
            60 *
            60 *
            1000,
          path: "/",
        }
      );

      return res.redirect("/");
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      return res
        .status(500)
        .render("auth/login", {
          errors: [
            {
              msg:
                "Server Error",
            },
          ],
          oldInput: {
            email,
          },
        });
    }
  }
);

router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
      session: false,
    }
  )
);

router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      failureRedirect:
        "/auth/login?error=google_auth_failed",
      session: false,
    }
  ),

  googleController.googleCallback
);

router.get(
  "/logout",
  googleController.logout
);

module.exports = router;