const express = require("express");

const router = express.Router();
const Product = require("../models/product.model");

router.get("/", async (req, res) => {
  try {

    const products = await Product.find({
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log("Homepage Products:", products.length);

    res.render("pages/index", {
      products
    });

  } catch (error) {

    console.error("Homepage Error:", error);

    res.status(500).render("pages/index", {
      products: []
    });

  }
});

router.get("/aboutus", (req, res) => {
  res.render("pages/aboutus");
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

router.post("/contact", (req, res) => {
  res.render("contact-success");
});

router.get("/contactconfirm", (req, res) => {
  res.render("contactconfirm");
});

router.get("/profile", (req, res) => {
  res.render("pages/profile");
});

module.exports = router;