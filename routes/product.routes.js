const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload =
  require("../middleware/multer.middleware");

const {
  auth,
  optionalAuth,
} =
  require("../middleware/auth");

const {
  ApiError,
} =
  require("../utils/ApiError");

const Product =
  require("../models/product.model");

const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} =
  require("../controllers/product.controller");

const handleUpload =
  (req, res, next) => {

    upload.array(
      "images",
      8
    )(
      req,
      res,
      (err) => {

        if (
          err instanceof
          multer.MulterError
        ) {

          if (
            err.code ===
            "LIMIT_FILE_SIZE"
          ) {

            return next(
              new ApiError(
                400,
                "Each image must be less than 5 MB"
              )
            );
          }

          if (
            err.code ===
            "LIMIT_UNEXPECTED_FILE"
          ) {

            return next(
              new ApiError(
                400,
                "Maximum 8 images are allowed"
              )
            );
          }


          return next(
            new ApiError(
              400,
              err.message ||
                "File upload failed"
            )
          );
        }

        if (err) {

          return next(
            new ApiError(
              400,
              err.message ||
                "Only image files are allowed"
            )
          );
        }


        next();
      }
    );
  };

router.get(
  "/shop",
  optionalAuth,
  async (req, res, next) => {

    try {

      const products =
        await Product.find({
          isActive: true,
        })
        .populate(
          "seller",
          "name email profileImage role"
        )
        .sort({
          createdAt: -1,
        });


      return res.render(
        "products/index",
        {
          title:
            "Shop New Clothes",

          products,

          user:
            req.user ||
            null,
        }
      );

    } catch (error) {

      next(error);
    }
  }
);

router.get(
  "/create",
  auth,
  (req, res, next) => {

    try {

      if (
        req.user.role !== "seller" &&
        req.user.role !== "admin"
      ) {

        return res.status(403).render(
          "error",
          {
            title:
              "Access Denied",

            message:
              "Only sellers and admins can sell products.",
          }
        );
      }


      return res.render(
        "products/create",
        {
          title:
            "Sell New Clothes",

          user:
            req.user,
        }
      );

    } catch (error) {

      next(error);
    }
  }
);

router.get(
  "/view/:id",
  optionalAuth,
  async (req, res, next) => {

    try {

      const product =
        await Product.findOne({
          _id:
            req.params.id,

          isActive:
            true,
        })
        .populate(
          "seller",
          "name email profileImage role"
        );


      if (!product) {

        return res.status(404).render(
          "404",
          {
            title:
              "Product Not Found",

            message:
              "The product you are looking for does not exist.",
          }
        );
      }


      return res.render(
        "products/details",
        {
          title:
            product.name,

          product,

          user:
            req.user ||
            null,
        }
      );

    } catch (error) {

      next(error);
    }
  }
);

router.get(
  "/api",
  getAllProducts
);

router.get(
  "/api/:id",
  getProductById
);

router.post(
  "/api",
  auth,
  handleUpload,
  createProduct
);

router.put(
  "/api/:id",
  auth,
  handleUpload,
  updateProduct
);

router.get(
  "/edit/:id",
  auth,
  async (req, res, next) => {

    try {

      const query = { _id: req.params.id };

      if (req.user.role !== "admin") {
        query.seller = req.user._id;
      }

      const product = await Product.findOne(query);

      if (!product) {
        return res.status(404).render("404", {
          title: "Product Not Found",
          message: "This product does not exist or you don't have access.",
        });
      }

      return res.render("products/edit", {
        title: "Edit Product",
        product,
        user: req.user,
      });

    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/api/:id",
  auth,
  deleteProduct
);

module.exports = router;