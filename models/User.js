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
      googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
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

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    uploadedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothProduct",
      },
    ],

    sellerDetails: {

      businessName: {
        type: String,
        trim: true,
      },

      businessType: {
        type: String,
        enum: [
          "INDIVIDUAL",
          "PROPRIETORSHIP",
          "PARTNERSHIP",
          "PRIVATE_LIMITED",
          "LLP",
        ],
      },

      gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
      },

      panNumber: {
        type: String,
        trim: true,
        uppercase: true,
      },

      pickupAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
          type: String,
          default: "India",
        },
      },

      payout: {
        accountHolderName: String,
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        upiId: String,
      },
    },

    sellerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },

    sellerRejectionReason: {
      type: String,
      default: "",
    },

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

    donatedClothes: {
      type: Number,
      default: 0,
    },

    sustainabilityScore: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    ratings: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {

  if (
    this.role === "seller" &&
    !this.sellerStatus
  ) {
    this.sellerStatus = "pending";
  }

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(
    candidatePassword,
    this.password
  );
};

module.exports = mongoose.model("User", userSchema);
