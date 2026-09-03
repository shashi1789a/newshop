const express = require("express");

const router = express.Router();

const Product = require("../models/Product");

const upload = require("../config/multer");

const authadmin = require(
  "../middleware/authadmin"
);

// ======================================================
// CREATE PRODUCT PAGE
// ======================================================

router.get(
  "/create-product",

  authadmin,

  (req, res) => {

    res.render(
      "admin/createProduct"
    );

  }
);

// ======================================================
// CREATE PRODUCT
// ======================================================

router.post(
  "/create",

  authadmin,

  upload.single("image"),

  async (req, res) => {

    try {

      const {
        name,
        description,
        price,
        category,
        stock,
        rating,
        isFeatured,
        discount,
      } = req.body;

      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !name ||
        !description ||
        !price ||
        !category
      ) {

        return res.status(400).send(
          "Required fields missing"
        );
      }

      // ======================================================
      // CREATE PRODUCT
      // ======================================================

      const product =
        new Product({

          name,

          description,

          price:
            Number(price),

          category,

          stock:
            Number(stock) || 0,

          rating:
            Number(rating) || 0,

          isFeatured:
            isFeatured === "true"
              ? true
              : false,

          discount:
            Number(discount) || 0,

          image:
            req.file
              ? req.file.buffer
              : undefined,
        });

      // ======================================================
      // SAVE PRODUCT
      // ======================================================

      await product.save();

      console.log(
        `Product Created: ${name}`
      );

      res.redirect("/shop");

    } catch (error) {

      console.error(
        "Create Product Error:",
        error
      );

      res.status(500).send(
        "Error creating product"
      );
    }
  }
);

// ======================================================
// GET SINGLE PRODUCT
// ======================================================

router.get(
  "/:id",

  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.redirect(
          "/shop"
        );
      }

      res.render(
        "products/productDetails",
        {
          product,
        }
      );

    } catch (error) {

      console.error(
        "Product Details Error:",
        error
      );

      res.redirect("/shop");
    }
  }
);

// ======================================================
// DELETE PRODUCT
// ======================================================

router.delete(
  "/delete/:id",

  authadmin,

  async (req, res) => {

    try {

      await Product.findByIdAndDelete(
        req.params.id
      );

      console.log(
        "Product Deleted"
      );

      res.redirect("/shop");

    } catch (error) {

      console.error(
        "Delete Product Error:",
        error
      );

      res.status(500).send(
        "Failed to delete product"
      );
    }
  }
);

module.exports = router;