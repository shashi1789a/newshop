const mongoose = require("mongoose");

const oldClothSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "shirt",
        "tshirt",
        "jeans",
        "jacket",
        "kurta",
        "saree",
        "hoodie",
        "kidswear",
        "shoes",
        "other",
      ],
      index: true,
    },

    brand: {
      type: String,
      default: "local",
      trim: true,
      maxlength: 100,
    },

    size: {
      type: String,
      enum: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "FREE_SIZE",
      ],
    },

    gender: {
      type: String,
      enum: [
        "male",
        "female",
        "unisex",
      ],
    },

    fabricType: {
      type: String,
      required: true,
      enum: [
        "cotton",
        "denim",
        "wool",
        "silk",
        "polyester",
        "linen",
        "rayon",
        "other",
      ],
    },

    color: {
      type: String,
      trim: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    condition: {
      type: String,
      required: true,
      enum: [
        "like_new",
        "good",
        "average",
        "damaged",
      ],
      index: true,
    },

    ageOfCloth: {
      type: Number,
      required: true,
      min: 0,
    },

    damageLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    estimatedMarketValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumSellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumSellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    recommendedSellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    commissionPercentage: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    commissionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    sellerPayout: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "sold",
        "inactive",
        "rejected",
      ],
      default: "active",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        comment: {
          type: String,
          trim: true,
          maxlength: 1000,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

oldClothSchema.index({
  title: "text",
  description: "text",
  brand: "text",
});

oldClothSchema.index({
  category: 1,
  condition: 1,
});

oldClothSchema.index({
  seller: 1,
  createdAt: -1,
});

oldClothSchema.index({
  status: 1,
  createdAt: -1,
});

const OldCloth =
  mongoose.model(
    "OldCloth",
    oldClothSchema
  );

module.exports = OldCloth;