const OldCloth = require("../models/oldCloth.model");

const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const {
  asyncHandler,
} = require("../utils/asyncHandler");

const {
  ApiResponse,
} = require("../utils/ApiResponse");

const {
  ApiError,
} = require("../utils/ApiError");


const calculateClothPrice = ({
  category,
  brand,
  condition,
  ageOfCloth,
  damageLevel = 0,
  originalPrice = 0,
}) => {


  const categoryBasePrice = {
    shirt: 700,
    tshirt: 500,
    jeans: 900,
    jacket: 1400,
    kurta: 800,
    saree: 1200,
    hoodie: 1000,
    kidswear: 400,
    shoes: 1000,
    other: 600,
  };

  let basePrice =
    categoryBasePrice[category] || 600;


  const premiumBrands = [
    "nike",
    "adidas",
    "puma",
    "levi's",
    "levis",
    "zara",
    "h&m",
    "uniqlo",
    "tommy hilfiger",
    "calvin klein",
    "lacoste",
  ];

  const brandName =
    (brand || "local")
      .toLowerCase()
      .trim();

  let brandMultiplier = 1;

  if (
    premiumBrands.includes(
      brandName
    )
  ) {
    brandMultiplier = 1.35;
  } else if (
    brandName !== "local"
  ) {
    brandMultiplier = 1.10;
  }

  const conditionMultiplier = {
    like_new: 0.80,
    good: 0.65,
    average: 0.45,
    damaged: 0.20,
  };

  const conditionRate =
    conditionMultiplier[
      condition
    ] || 0.45;


  const age =
    Number(ageOfCloth);

  let ageMultiplier = 1;

  if (age <= 1) {
    ageMultiplier = 1;
  } else if (age <= 2) {
    ageMultiplier = 0.90;
  } else if (age <= 3) {
    ageMultiplier = 0.80;
  } else if (age <= 5) {
    ageMultiplier = 0.65;
  } else {
    ageMultiplier = 0.50;
  }

  const damage =
    Number(damageLevel);

  const damageMultiplier =
    1 - damage / 100;


  const original =
    Number(originalPrice || 0);

  if (original > 0) {
    const originalBasedPrice =
      original * conditionRate;

    basePrice =
      Math.max(
        basePrice,
        originalBasedPrice
      );
  }


  let estimatedMarketValue =
    basePrice *
    brandMultiplier *
    ageMultiplier *
    damageMultiplier;

  estimatedMarketValue =
    Math.max(
      100,
      Math.round(
        estimatedMarketValue / 50
      ) * 50
    );

  const minimumSellingPrice =
    Math.round(
      (estimatedMarketValue * 0.85) / 50
    ) * 50;

  const maximumSellingPrice =
    Math.round(
      (estimatedMarketValue * 1.15) / 50
    ) * 50;


  const recommendedSellingPrice =
    estimatedMarketValue;


  const commissionPercentage = 10;

  const commissionAmount =
    Math.round(
      (
        recommendedSellingPrice *
        commissionPercentage
      ) / 100
    );


  const sellerPayout =
    recommendedSellingPrice -
    commissionAmount;

  return {
    estimatedMarketValue,

    minimumSellingPrice,

    maximumSellingPrice,

    recommendedSellingPrice,

    commissionPercentage,

    commissionAmount,

    sellerPayout,
  };
};

const estimateOldClothPrice =
  asyncHandler(
    async (req, res) => {

      const {
        category,
        brand,
        condition,
        ageOfCloth,
        damageLevel,
        originalPrice,
      } = req.body;



      if (
        !category ||
        !condition ||
        ageOfCloth === undefined
      ) {
        throw new ApiError(
          400,
          "Category, condition and age of cloth are required"
        );
      }

      const age =
        Number(ageOfCloth);

      const damage =
        Number(damageLevel || 0);

      const original =
        Number(originalPrice || 0);

      if (
        Number.isNaN(age) ||
        age < 0
      ) {
        throw new ApiError(
          400,
          "Invalid cloth age"
        );
      }

      if (
        Number.isNaN(damage) ||
        damage < 0 ||
        damage > 100
      ) {
        throw new ApiError(
          400,
          "Damage level must be between 0 and 100"
        );
      }

      const price =
        calculateClothPrice({
          category,
          brand,
          condition,
          ageOfCloth: age,
          damageLevel: damage,
          originalPrice: original,
        });


      return res.status(200).json(
        new ApiResponse(
          200,
          "Cloth price estimated successfully",
          {
            ...price,

            factors: {
              category,
              brand: brand || "local",
              condition,
              ageOfCloth: age,
              damageLevel: damage,
              originalPrice: original,
            },

            disclaimer:
              "This is an estimated resale value. Actual selling price may vary depending on brand demand, condition, photos, market demand and buyer interest.",
          }
        )
      );
    }
  );


const uploadOldCloth =
  asyncHandler(
    async (req, res) => {

      const {
        title,
        description,
        category,
        brand,
        size,
        gender,
        fabricType,
        weight,
        condition,
        ageOfCloth,
        damageLevel,
        color,
        originalPrice,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !fabricType ||
        !weight ||
        !condition ||
        ageOfCloth === undefined
      ) {
        throw new ApiError(
          400,
          "Please provide all required cloth details"
        );
      }


      if (
        !req.files ||
        req.files.length === 0
      ) {
        throw new ApiError(
          400,
          "Please upload at least one cloth image"
        );
      }


      const age =
        Number(ageOfCloth);

      const damage =
        Number(damageLevel || 0);

      const original =
        Number(originalPrice || 0);

      const clothWeight =
        Number(weight);

      if (
        Number.isNaN(age) ||
        age < 0
      ) {
        throw new ApiError(
          400,
          "Invalid cloth age"
        );
      }

      if (
        Number.isNaN(damage) ||
        damage < 0 ||
        damage > 100
      ) {
        throw new ApiError(
          400,
          "Damage level must be between 0 and 100"
        );
      }

      if (
        Number.isNaN(clothWeight) ||
        clothWeight < 0
      ) {
        throw new ApiError(
          400,
          "Invalid cloth weight"
        );
      }

      const price =
        calculateClothPrice({
          category,
          brand,
          condition,
          ageOfCloth: age,
          damageLevel: damage,
          originalPrice: original,
        });


      const uploadedImages = [];

      try {

        for (
          const file of req.files
        ) {

          const uploaded =
            await uploadOnCloudinary(
              file.path
            );

          if (!uploaded) {

            throw new ApiError(
              500,
              "Failed to upload cloth image"
            );
          }

          uploadedImages.push({
            url:
              uploaded.secure_url,

            publicId:
              uploaded.public_id,
          });
        }

        const cloth =
          await OldCloth.create({

            title,

            description,

            category,

            brand:
              brand || "local",

            size,

            gender,

            fabricType,

            color,

            weight:
              clothWeight,

            condition,

            ageOfCloth:
              age,

            damageLevel:
              damage,

            originalPrice:
              original,

            images:
              uploadedImages,

            seller:
              req.user._id,

            estimatedMarketValue:
              price.estimatedMarketValue,

            minimumSellingPrice:
              price.minimumSellingPrice,

            maximumSellingPrice:
              price.maximumSellingPrice,

            recommendedSellingPrice:
              price.recommendedSellingPrice,

            commissionPercentage:
              price.commissionPercentage,

            commissionAmount:
              price.commissionAmount,

            sellerPayout:
              price.sellerPayout,

            status:
              "active",
          });

        return res.status(201).json(
          new ApiResponse(
            201,
            "Old cloth uploaded successfully",
            cloth
          )
        );

      } catch (error) {

        for (
          const image of uploadedImages
        ) {

          await deleteFromCloudinary(
            image.publicId
          );
        }

        throw error;
      }
    }
  );


const getAllOldCloths =
  asyncHandler(
    async (req, res) => {

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
        query.category =
          category;
      }

      if (condition) {
        query.condition =
          condition;
      }

      if (brand) {
        query.brand =
          new RegExp(
            brand,
            "i"
          );
      }

      if (search) {

        query.$text = {
          $search: search,
        };
      }

      if (
        minPrice ||
        maxPrice
      ) {

        query.recommendedSellingPrice =
          {};

        if (minPrice) {
          query
            .recommendedSellingPrice
            .$gte =
            Number(minPrice);
        }

        if (maxPrice) {
          query
            .recommendedSellingPrice
            .$lte =
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

      } else if (
        sort === "price_high"
      ) {

        sortQuery = {
          recommendedSellingPrice: -1,
        };

      } else if (
        sort === "oldest"
      ) {

        sortQuery = {
          createdAt: 1,
        };
      }

      const cloths =
        await OldCloth.find(query)
          .populate(
            "seller",
            "name email"
          )
          .sort(sortQuery);

      return res.status(200).json(
        new ApiResponse(
          200,
          "Old cloths fetched successfully",
          cloths
        )
      );
    }
  );

const getSingleOldCloth = async (req, res) => {
  try {
    const cloth = await OldCloth.findById(req.params.id)
      .populate("seller", "fullname email picture")
      .populate("reviews.user", "fullname picture");

    if (!cloth) {
      return res.status(404).send("Cloth not found");
    }

    const relatedClothes = await OldCloth.find({
      _id: { $ne: cloth._id },
      category: cloth.category,
      status: "active"
    })
      .limit(4)
      .select("title images recommendedSellingPrice category");


    cloth.views += 1;
    await cloth.save();

    res.render("oldClothes/clothDetails", {
      cloth,
      relatedClothes
    });

  } catch (error) {
    console.error(error);

    res.status(500).send("Server Error");
  }
};

const deleteOldCloth =
  asyncHandler(
    async (req, res) => {

      const cloth =
        await OldCloth.findById(
          req.params.id
        );

      if (!cloth) {

        throw new ApiError(
          404,
          "Old cloth not found"
        );
      }

      if (
        cloth.seller.toString() !==
        req.user._id.toString()
      ) {

        throw new ApiError(
          403,
          "You are not authorized to delete this cloth"
        );
      }

      for (
        const image of cloth.images
      ) {

        await deleteFromCloudinary(
          image.publicId
        );
      }

      await OldCloth.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          "Old cloth deleted successfully",
          null
        )
      );
    }
  );

module.exports = {
  uploadOldCloth,
  getAllOldCloths,
  getSingleOldCloth,
  deleteOldCloth,
  estimateOldClothPrice,
};