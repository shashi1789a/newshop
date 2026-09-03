const express = require("express");

const router = express.Router();

// ======================================================
// CONTROLLERS
// ======================================================

const {
  uploadOldCloth,
  getAllOldCloths,
  getSingleOldCloth,
  deleteOldCloth,
} = require(
  "../controllers/oldCloth.controller"
);

// ======================================================
// MODELS
// ======================================================

const OldCloth = require(
  "../models/oldCloth.model"
);

// ======================================================
// MIDDLEWARE
// ======================================================

const upload = require(
  "../config/multer"
);

const {
  auth,
} = require(
  "../middleware/auth"
);

// ======================================================
// UPLOAD PAGE
// ======================================================

router.get(
  "/upload",
  auth,
  (req, res) => {

    res.render(
      "oldClothes/uploadOldCloth"
    );

  }
);

// ======================================================
// SELLER DASHBOARD
// ======================================================

router.get(
  "/seller/dashboard",
  auth,
  async (req, res) => {

    try {

      const cloths =
        await OldCloth.find({

          seller:
            req.user._id,

        })

          .sort({
            createdAt: -1,
          });

      res.render(
        "oldClothes/sellerDashboard",
        {
          cloths,
        }
      );

    } catch (error) {

      console.error(
        "Seller Dashboard Error:",
        error
      );

      res.redirect("/");

    }

  }
);

// ======================================================
// UPLOAD OLD CLOTH
// ======================================================

router.post(
  "/upload",

  auth,

  upload.array(
    "images",
    5
  ),

  uploadOldCloth
);

// ======================================================
// GET ALL OLD CLOTHS PAGE
// ======================================================

router.get(
  "/",

  async (req, res) => {

    try {

      const cloths =
        await OldCloth.find()

          .populate(
            "seller",
            "name"
          )

          .sort({
            createdAt: -1,
          });

      res.render(
        "oldClothes/oldClothes",
        {
          cloths,
        }
      );

    } catch (error) {

      console.error(
        "Old Clothes Page Error:",
        error
      );

      res.redirect("/");

    }

  }
);

// ======================================================
// GET SINGLE OLD CLOTH PAGE
// ======================================================

router.get(
  "/:id",

  async (req, res) => {

    try {

      const cloth =
        await OldCloth.findById(
          req.params.id
        )

          .populate(
            "seller",
            "name email"
          );

      if (!cloth) {

        return res.redirect(
          "/old-clothes"
        );

      }

      res.render(
        "oldClothes/singleOldCloth",
        {
          cloth,
        }
      );

    } catch (error) {

      console.error(
        "Single Cloth Error:",
        error
      );

      res.redirect(
        "/old-clothes"
      );

    }

  }
);

// ======================================================
// DELETE OLD CLOTH
// ======================================================

router.delete(
  "/:id",

  auth,

  async (req, res) => {

    try {

      const cloth =
        await OldCloth.findById(
          req.params.id
        );

      // ================= NOT FOUND =================
      if (!cloth) {

        return res.status(404).send(
          "Cloth not found"
        );

      }

      // ================= OWNER CHECK =================
      if (
        cloth.seller.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).send(
          "Unauthorized"
        );

      }

      // ================= DELETE =================
      await OldCloth.findByIdAndDelete(
        req.params.id
      );

      console.log(
        "Old Cloth Deleted"
      );

      res.redirect(
        "/old-clothes/seller/dashboard"
      );

    } catch (error) {

      console.error(
        "Delete Cloth Error:",
        error
      );

      res.status(500).send(
        "Server Error"
      );
    }
  }
);

module.exports = router;