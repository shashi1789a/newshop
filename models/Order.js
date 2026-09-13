const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],

      required: true,

      validate: {
        validator: function (items) {
          return (
            Array.isArray(items) &&
            items.length > 0
          );
        },

        message:
          "Order must contain at least one product",
      },
    },

    shippingAddress: {

      name: {
        type: String,
        required: true,
        trim: true,
      },

      street: {
        type: String,
        required: true,
        trim: true,
      },

      locality: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      zipCode: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

    },

    deliveryDate: {
      type: String,
      default: "",
      trim: true,
    },

    timeSlot: {
      type: String,
      default: "",
      trim: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    couponCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
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
  ],

  default: "COD",

  required: true,
},

    paymentStatus: {

      type: String,

      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
      ],

      default: "pending",

      required: true,

      index: true,
    },

    paymentGateway: {

      type: String,

      enum: [
        "COD",
        "RAZORPAY",
      ],

      default: "COD",

      required: true,
    },

    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
      trim: true,
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    paymentFailureReason: {
      type: String,
      default: "",
      trim: true,
    },


    paymentFailureCode: {
      type: String,
      default: "",
      trim: true,
    },

    refundId: {
      type: String,
      default: "",
      trim: true,
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

    orderStatus: {

      type: String,

      enum: [
        "PENDING",
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED",
        "REFUND_PENDING",
        "REFUNDED",
      ],

      default: "PENDING",

      required: true,

      index: true,
    },

    trackingNumber: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    cancellationReason: {
      type: String,
      default: "",
      trim: true,
    },


    cancelledAt: {
      type: Date,
      default: null,
    },

    returnReason: {
      type: String,
      default: "",
      trim: true,
    },


    returnRequestedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

  },

  {
    timestamps: true,
  }
);

orderSchema.index({
  user: 1,
  createdAt: -1,
});


orderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});


orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});


orderSchema.index({
  razorpayOrderId: 1,
});


orderSchema.index({
  razorpayPaymentId: 1,
});

module.exports = mongoose.model(
  "Order",
  orderSchema
);

