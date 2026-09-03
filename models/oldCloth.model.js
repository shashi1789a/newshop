const mongoose = require("mongoose");

const oldClothSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
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
      ],
    },

    brand: {
      type: String,
      default: "local",
    },

    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
    },

    fabricType: {
      type: String,
      enum: ["cotton", "denim", "wool", "silk", "polyester"],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["like_new", "good", "average", "damaged"],
      required: true,
    },

    ageOfCloth: {
      type: Number,
      required: true,
    },

    damageLevel: {
      type: Number,
      default: 0,
    },

    color: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const OldCloth = mongoose.model("OldCloth", oldClothSchema);
module.exports = OldCloth;