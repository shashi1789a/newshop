const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "T_SHIRTS",
        "SHIRTS",
        "JEANS",
        "TROUSERS",
        "JACKETS",
        "HOODIES",
        "SWEATERS",
        "DRESSES",
        "SKIRTS",
        "SHORTS",
        "TOPS",
        "KURTAS",
        "SAREES",
        "TRACK_PANTS",
        "OTHER",
      ],
    },

    brand: {
      type: String,
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },

    size: {
      type: String,
      required: [true, "Product size is required"],
      enum: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        "FREE_SIZE",
      ],
    },

    gender: {
      type: String,
      required: [true, "Product gender is required"],
      enum: [
        "MEN",
        "WOMEN",
        "KIDS",
        "UNISEX",
      ],
    },

    fabricType: {
      type: String,
      trim: true,
      maxlength: [100, "Fabric type cannot exceed 100 characters"],
    },

    color: {
      type: String,
      trim: true,
      maxlength: [50, "Color cannot exceed 50 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be greater than 0"],
    },

    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100"],
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    images: {
      type: [
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

      validate: {
        validator: function (images) {
          return images && images.length >= 1;
        },

        message: "At least one product image is required",
      },
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
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

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

productSchema.index({
  category: 1,
  gender: 1,
});

productSchema.index({
  brand: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "Product",
  productSchema
);