const express = require("express");

const router = express.Router();

const {
  uploadOldCloth,
  getAllOldCloths,
  getSingleOldCloth,
  deleteOldCloth,
  estimateOldClothPrice,
} = require("../controllers/oldCloth.controller");

const OldCloth = require("../models/oldCloth.model");

const upload = require("../middleware/multer.middleware");

const { auth } = require("../middleware/auth");

router.get("/upload", auth, (req, res) => {
  res.render("oldClothes/uploadOldCloth");
});

router.post(
  "/estimate-price",
  auth,
  estimateOldClothPrice
);

router.post(
  "/upload",
  auth,
  upload.array("images", 5),
  uploadOldCloth
);

router.get("/", async (req, res) => {

  try {

    const {
      category,
      condition,
      brand,
      search,
      minPrice,
      maxPrice,
      sort = "latest",
    } = req.query;

    const query = {
      status: "active",
    };

    if (category) {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (brand) {
      query.brand = new RegExp(brand, "i");
    }

    if (search) {
      query.$text = {
        $search: search,
      };
    }

    if (minPrice || maxPrice) {

      query.recommendedSellingPrice = {};

      if (minPrice) {
        query.recommendedSellingPrice.$gte =
          Number(minPrice);
      }

      if (maxPrice) {
        query.recommendedSellingPrice.$lte =
          Number(maxPrice);
      }
    }

    let sortQuery = {
      createdAt: -1,
    };

    if (sort === "price_low") {
      sortQuery = {
        recommendedSellingPrice: 1,
      };
    }

    if (sort === "price_high") {
      sortQuery = {
        recommendedSellingPrice: -1,
      };
    }

    if (sort === "oldest") {
      sortQuery = {
        createdAt: 1,
      };
    }

    const cloths =
      await OldCloth.find(query)
        .populate("seller", "name email")
        .sort(sortQuery);

    res.render(
      "oldClothes/old-clothes",
      {
        cloths,
        filters: req.query,
      }
    );

  } catch (error) {

    console.error(
      "Old Clothes Error:",
      error
    );

    res.status(500).render(
      "oldClothes/old-clothes",
      {
        cloths: [],
        filters: req.query,
        error: "Unable to load old clothes",
      }
    );
  }

});


router.get(
  "/:id",
  getSingleOldCloth
);

router.delete(
  "/:id",
  auth,
  deleteOldCloth
);

module.exports = router;