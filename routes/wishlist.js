const express = require("express");

const router = express.Router();

const { auth } = require(
  "../middleware/auth"
);

const User = require("../models/User");

const Product = require("../models/Product");

// ======================================================
// VIEW WISHLIST
// ======================================================

router.get(
  "/",

  auth,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      const wishlistProducts =
        await Product.find({

          _id: {
            $in: user.wishlist,
          },

        });

      res.render(
        "wishlist/wishlist",
        {
          wishlist:
            wishlistProducts,
        }
      );

    } catch (error) {

      console.error(
        "Wishlist Error:",
        error
      );

      res.redirect("/");
    }
  }
);

// ======================================================
// ADD TO WISHLIST
// ======================================================

router.get(
  "/add/:productId",

  auth,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      const product =
        await Product.findById(
          req.params.productId
        );

      // ================= PRODUCT CHECK =================
      if (!product) {

        return res.status(404).send(
          "Product not found"
        );
      }

      const productId =
        req.params.productId;

      // ================= AVOID DUPLICATE =================
      const alreadyExists =
        user.wishlist.some(
          (id) =>
            id.toString() ===
            productId
        );

      if (!alreadyExists) {

        user.wishlist.push(
          productId
        );

        await user.save();
      }

      res.redirect("/wishlist");

    } catch (error) {

      console.error(
        "Add Wishlist Error:",
        error
      );

      res.redirect("/");
    }
  }
);

// ======================================================
// REMOVE FROM WISHLIST
// ======================================================

router.get(
  "/remove/:productId",

  auth,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      user.wishlist =
        user.wishlist.filter(
          (id) =>
            id.toString() !==
            req.params.productId
        );

      await user.save();

      res.redirect(
        "/wishlist"
      );

    } catch (error) {

      console.error(
        "Remove Wishlist Error:",
        error
      );

      res.redirect(
        "/wishlist"
      );
    }
  }
);

// ======================================================
// MOVE TO CART
// ======================================================

router.get(
  "/move-to-cart/:productId",

  auth,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      const product =
        await Product.findById(
          req.params.productId
        );

      // ================= PRODUCT CHECK =================
      if (!product) {

        return res.status(404).send(
          "Product not found"
        );
      }

      const productId =
        req.params.productId;

      // ================= REMOVE FROM WISHLIST =================
      user.wishlist =
        user.wishlist.filter(
          (id) =>
            id.toString() !==
            productId
        );

      // ================= CHECK CART =================
      const existingCartItem =
        user.cart.find(
          (item) =>
            item.product.toString() ===
            productId
        );

      // ================= UPDATE CART =================
      if (existingCartItem) {

        existingCartItem.quantity += 1;

      } else {

        user.cart.push({
          product: productId,
          quantity: 1,
        });
      }

      await user.save();

      res.redirect(
        "/cart"
      );

    } catch (error) {

      console.error(
        "Move To Cart Error:",
        error
      );

      res.redirect(
        "/wishlist"
      );
    }
  }
);

// ======================================================
// CLEAR WISHLIST
// ======================================================

router.get(
  "/clear",

  auth,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      user.wishlist = [];

      await user.save();

      res.redirect(
        "/wishlist"
      );

    } catch (error) {

      console.error(
        "Clear Wishlist Error:",
        error
      );

      res.redirect(
        "/wishlist"
      );
    }
  }
);

module.exports = router;