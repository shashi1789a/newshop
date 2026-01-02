// // routes/cart.js
// const express = require("express");
// const router = express.Router();
// const { auth } = require("../middleware/auth");
// const User = require("../models/User");
// const Product = require("../models/Product");

// // View cart page
// router.get("/", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("cart.items.product");
//     let total = 0;
//     user.cart.items.forEach(item => {
//       total += item.product.price * item.quantity;
//     });
//     res.render("cart", { cart: user.cart, total });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Add to cart
// router.post("/add", auth, async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const product = await Product.findById(productId);

//     if (!product) return res.status(404).json({ message: "Product not found" });
//     if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });

//     const user = await User.findById(req.user._id);
//     const existingItem = user.cart.items.find(item => item.product.toString() === productId);

//     if (existingItem) existingItem.quantity += parseInt(quantity);
//     else user.cart.items.push({ product: productId, quantity });

//     await user.save();
//     res.redirect("/cart");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update quantity
// router.post("/update/:productId", auth, async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const product = await Product.findById(req.params.productId);

//     if (!product) return res.status(404).json({ message: "Product not found" });
//     if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });

//     const user = await User.findById(req.user._id);
//     const item = user.cart.items.find(item => item.product.toString() === req.params.productId);

//     if (!item) return res.status(404).json({ message: "Item not found in cart" });

//     item.quantity = parseInt(quantity);
//     await user.save();
//     res.redirect("/cart");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Remove from cart
// router.post("/remove/:productId", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     user.cart.items = user.cart.items.filter(item => item.product.toString() !== req.params.productId);
//     await user.save();
//     res.redirect("/cart");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;