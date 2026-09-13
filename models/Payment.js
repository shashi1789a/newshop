const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },


    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

 paymentMethod: {
  type: String,
  enum: [
    "COD",
    "RAZORPAY",
    "credit_card",
    "debit_card",
    "net_banking",
    "upi"
  ],
  default: "COD"
},

    gateway: {
      type: String,

      enum: [
        "RAZORPAY",
        "COD",
      ],

      default: "RAZORPAY",
    },

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    status: {
      type: String,

      enum: [
        "created",
        "pending",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded",
      ],

      default: "created",
      index: true,
    },

    failureReason: {
      type: String,
      default: "",
      trim: true,
    },


    failureCode: {
      type: String,
      default: "",
      trim: true,
    },

    refundId: {
      type: String,
      default: "",
    },


    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },


    refundStatus: {
      type: String,

      enum: [
        "none",
        "pending",
        "processed",
        "failed",
      ],

      default: "none",
    },

    webhookReceived: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: Object,
      default: {},
    },
  },

  {
    timestamps: true,
  }
);

paymentSchema.index({
  user: 1,
  createdAt: -1,
});

paymentSchema.index({
  order: 1,
  createdAt: -1,
});


module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );