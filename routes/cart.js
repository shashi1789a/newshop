const express = require("express");

const User = require("../models/User");
const Product = require("../models/product.model");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    }).populate("cart.product");

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.render("products/cart", {
      cart: user.cart || [],
      user,
    });
  } catch (error) {
    console.error("Cart Error:", error);

    return res.status(500).send("Unable to load cart");
  }
});

router.get("/add/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (!product.stock || product.stock <= 0) {
      return res.status(400).send("Product is out of stock");
    }

    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }

    const existingCartItem = user.cart.find(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    if (existingCartItem) {
      if (existingCartItem.quantity >= product.stock) {
        return res.status(400).send(
          `Only ${product.stock} item(s) available in stock`
        );
      }

      existingCartItem.quantity += 1;
    }

    else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }
    await user.save();

    return res.redirect("/cart");
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).send("Unable to add product to cart");
  }
});

router.get("/remove/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.cart = (user.cart || []).filter(
      (item) =>
        !item.product ||
        item.product.toString() !== productId
    );

    await user.save();

    return res.redirect("/cart");
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    return res.status(500).send("Unable to remove product");
  }
});

router.get("/decrease/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const cartItem = user.cart.find(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    if (!cartItem) {
      return res.redirect("/cart");
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      user.cart = user.cart.filter(
        (item) =>
          !item.product ||
          item.product.toString() !== productId
      );
    }

    await user.save();

    return res.redirect("/cart");
  } catch (error) {
    console.error("Decrease Cart Quantity Error:", error);

    return res.status(500).send(
      "Unable to decrease product quantity"
    );
  }
});

router.get("/increase/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const cartItem = user.cart.find(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).send(
        "Product is not in cart"
      );
    }

    if (cartItem.quantity >= product.stock) {
      return res.status(400).send(
        `Only ${product.stock} item(s) available in stock`
      );
    }

    cartItem.quantity += 1;

    await user.save();

    return res.redirect("/cart");
  } catch (error) {
    console.error("Increase Cart Quantity Error:", error);

    return res.status(500).send(
      "Unable to increase product quantity"
    );
  }
});

router.get("/clear", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.cart = [];

    await user.save();

    return res.redirect("/cart");
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).send(
      "Unable to clear cart"
    );
  }
});

module.exports = router;