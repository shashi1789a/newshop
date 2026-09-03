const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImage: {
      type: String,
      default: "",
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },

    // ================= CART =================
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothProduct",
      },
    ],

    // ================= WISHLIST =================
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothProduct",
      },
    ],

    // ================= MY PRODUCTS =================
    uploadedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothProduct",
      },
    ],

    // ================= SELLER DETAILS =================
    totalProductsSold: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    // ================= DONATION =================
    donatedClothes: {
      type: Number,
      default: 0,
    },

    // ================= ECO IMPACT =================
    sustainabilityScore: {
      type: Number,
      default: 0,
    },

    // ================= ACCOUNT STATUS =================
    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ================= USER RATINGS =================
    ratings: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    // ================= CREATED DATE =================
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ================= PASSWORD HASH =================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// ================= COMPARE PASSWORD =================
userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(
    candidatePassword,
    this.password
  );
};

module.exports = mongoose.model("User", userSchema);