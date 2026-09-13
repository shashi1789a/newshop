const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/auth");

const User = require("../models/User");
const Product = require("../models/product.model");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const wishlistIds = user.wishlist || [];

    const wishlistProducts = await Product.find({
      _id: {
        $in: wishlistIds,
      },
    });

    return res.render("wishlist/wishlist", {
      wishlist: wishlistProducts,
      user,
    });

  } catch (error) {
    console.error("Wishlist Error:", error);

    return res.status(500).send(
      "Unable to load wishlist"
    );
  }
});

router.get(
  "/add/:productId",
  auth,
  async (req, res) => {

    try {

      const { productId } = req.params;

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).send(
          "User not found"
        );
      }

      const product = await Product.findById(
        productId
      );

      if (!product) {
        return res.status(404).send(
          "Product not found"
        );
      }

      if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
      }

      const alreadyExists =
        user.wishlist.some(
          (id) =>
            id.toString() === productId
        );

      if (!alreadyExists) {

        user.wishlist.push(productId);

        await user.save();
      }

      return res.redirect("/wishlist");

    } catch (error) {

      console.error(
        "Add Wishlist Error:",
        error
      );

      return res.status(500).send(
        "Unable to add product to wishlist"
      );
    }
  }
);

router.get(
  "/remove/:productId",
  auth,
  async (req, res) => {

    try {

      const { productId } = req.params;

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).send(
          "User not found"
        );
      }

      user.wishlist = (
        user.wishlist || []
      ).filter(
        (id) =>
          id.toString() !== productId
      );

      await user.save();

      return res.redirect(
        "/wishlist"
      );

    } catch (error) {

      console.error(
        "Remove Wishlist Error:",
        error
      );

      return res.status(500).send(
        "Unable to remove product"
      );
    }
  }
);

router.get(
  "/move-to-cart/:productId",
  auth,
  async (req, res) => {

    try {

      const { productId } = req.params;

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).send(
          "User not found"
        );
      }

      const product = await Product.findById(
        productId
      );

      if (!product) {
        return res.status(404).send(
          "Product not found"
        );
      }

      if (
        product.stock !== undefined &&
        product.stock <= 0
      ) {
        return res.status(400).send(
          "Product is out of stock"
        );
      }

      user.wishlist = (
        user.wishlist || []
      ).filter(
        (id) =>
          id.toString() !== productId
      );

      if (!Array.isArray(user.cart)) {
        user.cart = [];
      }

      const existingCartItem =
        user.cart.find(
          (item) =>
            item.product &&
            item.product.toString() ===
              productId
        );

      if (existingCartItem) {

        existingCartItem.quantity =
          Number(
            existingCartItem.quantity || 0
          ) + 1;

      } else {

        user.cart.push({
          product: productId,
          quantity: 1,
        });
      }


      await user.save();

      return res.redirect(
        "/cart"
      );

    } catch (error) {

      console.error(
        "Move To Cart Error:",
        error
      );

      return res.redirect(
        "/wishlist"
      );
    }
  }
);

router.get(
  "/clear",
  auth,
  async (req, res) => {

    try {

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).send(
          "User not found"
        );
      }

      user.wishlist = [];

      await user.save();

      return res.redirect(
        "/wishlist"
      );

    } catch (error) {

      console.error(
        "Clear Wishlist Error:",
        error
      );

      return res.status(500).send(
        "Unable to clear wishlist"
      );
    }
  }
);


module.exports = router;

