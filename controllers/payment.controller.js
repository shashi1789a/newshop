const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Product = require("../models/product.model");
const User = require("../models/User");

const verifyRazorpaySignature = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

  const generatedBuffer =
    Buffer.from(generatedSignature, "utf8");

  const receivedBuffer =
    Buffer.from(razorpaySignature, "utf8");

  if (
    generatedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    generatedBuffer,
    receivedBuffer
  );
};

const adjustOrderStock = async (order) => {

  // Already adjusted
  if (order.stockAdjusted) {
    return {
      success: true,
      alreadyAdjusted: true,
    };
  }

  for (const item of order.items) {

    const product =
      await Product.findById(item.product);

    if (!product) {
      throw new Error(
        `Product not found: ${item.product}`
      );
    }

    const quantity =
      Number(item.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error(
        `Invalid quantity for product ${product._id}`
      );
    }

    if (
      !product.stock ||
      product.stock < quantity
    ) {
      throw new Error(
        `${product.name} does not have enough stock`
      );
    }

    product.stock -= quantity;

    if (product.stock < 0) {
      product.stock = 0;
    }

    await product.save();
  }

  order.stockAdjusted = true;

  await order.save();

  return {
    success: true,
    alreadyAdjusted: false,
  };
};

const clearUserCart = async (order) => {

  if (order.checkoutType !== "CART") {
    return;
  }

  const user =
    await User.findById(order.user);

  if (!user) {
    return;
  }

  user.cart = [];

  await user.save();
};

const createPaymentOrder = async (req, res) => {

  try {

    const {
      orderId
    } = req.params;

    const order =
      await Order.findOne({

        _id: orderId,

        user: req.user._id,

      });


    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found",

      });

    }

    if (
      order.paymentMethod !==
      "RAZORPAY"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid payment method",

      });

    }

    if (
      [
        "CANCELLED",
        "DELIVERED",
        "RETURNED",
        "REFUNDED",
      ].includes(order.orderStatus)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "This order cannot be paid",

      });

    }

    if (
      order.paymentStatus ===
      "completed"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Payment is already completed",

      });

    }

    const amount =
      Number(order.totalAmount);


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid order amount",

      });

    }

    let payment =
      await Payment.findOne({

        order: order._id,

        user: req.user._id,

        gateway: "RAZORPAY",

      });

    if (
      payment &&
      payment.razorpayOrderId &&
      [
        "created",
        "pending",
      ].includes(payment.status)
    ) {

      return res.json({

        success: true,

        message:
          "Payment order already exists",

        keyId:
          process.env.RAZORPAY_KEY_ID,

        razorpayOrderId:
          payment.razorpayOrderId,

        amount:
          Math.round(
            amount * 100
          ),

        currency:
          "INR",

        orderId:
          order._id,

        customerName:
          order.shippingAddress?.name ||
          "",

        customerPhone:
          order.shippingAddress?.phone ||
          "",

      });

    }

    const razorpayOrder =
      await razorpay.orders.create({

        amount:
          Math.round(
            amount * 100
          ),

        currency:
          "INR",

        receipt:
          `TC_${order._id
            .toString()
            .slice(-20)}`,

        notes: {

          orderId:
            order._id.toString(),

          userId:
            req.user._id.toString(),

        },

      });

    if (!payment) {

      payment =
        await Payment.create({

          user:
            req.user._id,

          order:
            order._id,

          amount,

          currency:
            "INR",

          // IMPORTANT
          paymentMethod:
            "RAZORPAY",

          gateway:
            "RAZORPAY",

          razorpayOrderId:
            razorpayOrder.id,

          status:
            "created",

        });

    } else {

      payment.amount =
        amount;

      payment.currency =
        "INR";

      payment.paymentMethod =
        "RAZORPAY";

      payment.gateway =
        "RAZORPAY";

      payment.razorpayOrderId =
        razorpayOrder.id;

      payment.razorpayPaymentId =
        "";

      payment.razorpaySignature =
        "";

      payment.status =
        "created";

      payment.failureReason =
        "";

      payment.failureCode =
        "";

      payment.webhookReceived =
        false;

      await payment.save();

    }

    order.paymentMethod =
      "RAZORPAY";

    if (
      Object.prototype.hasOwnProperty.call(
        order.toObject(),
        "paymentGateway"
      )
    ) {

      order.paymentGateway =
        "RAZORPAY";

    }

    order.paymentStatus =
      "pending";

    if (
      order.orderStatus ===
      "PENDING"
    ) {

      order.orderStatus =
        "PENDING";

    }

    await order.save();

    return res.json({

      success: true,

      message:
        "Razorpay order created",

      keyId:
        process.env.RAZORPAY_KEY_ID,

      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      orderId:
        order._id,

      customerName:
        order.shippingAddress?.name ||
        "",

      customerPhone:
        order.shippingAddress?.phone ||
        "",

    });


  } catch (error) {

    console.error(
      "Create Payment Order Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to create payment order",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });

  }

};

const showPaymentPage = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.orderId,

        user:
          req.user._id,

      })
      .populate(
        "items.product"
      );


    if (!order) {

      return res.status(404).send(
        "Order not found"
      );

    }

    if (
      order.paymentStatus ===
      "completed"
    ) {

      return res.redirect(
        "/payment/success/" +
        order._id
      );

    }

    if (
      order.paymentMethod !==
      "RAZORPAY"
    ) {

      return res.status(400).send(
        "This order is not configured for Razorpay payment"
      );

    }


    return res.render(
      "payment/checkout",
      {
        order,
      }
    );


  } catch (error) {

    console.error(
      "Payment Page Error:",
      error
    );


    return res.status(500).send(
      "Unable to load payment page"
    );

  }

};

const verifyPayment = async (
  req,
  res
) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      orderId,

    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Incomplete payment information",

      });

    }

    const order =
      await Order.findOne({

        _id:
          orderId,

        user:
          req.user._id,

      });


    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found",

      });

    }

    const payment =
      await Payment.findOne({

        order:
          order._id,

        user:
          req.user._id,

        razorpayOrderId:
          razorpay_order_id,

      });


    if (!payment) {

      return res.status(404).json({

        success: false,

        message:
          "Payment record not found",

      });

    }

    if (
      order.paymentStatus ===
        "completed" &&
      payment.status ===
        "captured"
    ) {

      return res.json({

        success: true,

        message:
          "Payment already verified",

        orderId:
          order._id,

      });

    }

    const isSignatureValid =
      verifyRazorpaySignature(

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature

      );


    if (!isSignatureValid) {

      payment.status =
        "failed";

      payment.failureReason =
        "Invalid Razorpay signature";

      payment.failureCode =
        "SIGNATURE_VERIFICATION_FAILED";

      await payment.save();


      return res.status(400).json({

        success: false,

        message:
          "Payment verification failed",

      });

    }

    if (
      payment.razorpayPaymentId &&
      payment.razorpayPaymentId !==
        razorpay_payment_id
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Payment ID mismatch",

      });

    }

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.razorpaySignature =
      razorpay_signature;

    payment.status =
      "captured";

    payment.failureReason =
      "";

    payment.failureCode =
      "";

    await payment.save();

    order.paymentStatus =
      "completed";

    order.orderStatus =
      "CONFIRMED";


    if (
      order.paymentGateway !==
      undefined
    ) {

      order.paymentGateway =
        "RAZORPAY";

    }


    await order.save();

    try {

      await adjustOrderStock(
        order
      );

    } catch (stockError) {

      console.error(
        "Stock Adjustment Error:",
        stockError
      );

      return res.status(500).json({

        success: false,

        message:
          "Payment successful but stock update requires attention",

        orderId:
          order._id,

      });

    }

    await clearUserCart(
      order
    );

    return res.json({

      success: true,

      message:
        "Payment verified successfully",

      orderId:
        order._id,

    });


  } catch (error) {

    console.error(
      "Verify Payment Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to verify payment",

    });

  }

};


const paymentFailed = async (
  req,
  res
) => {

  try {

    const {

      orderId,

      razorpayOrderId,

      reason,

      code,

    } = req.body;


    const order =
      await Order.findOne({

        _id:
          orderId,

        user:
          req.user._id,

      });


    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found",

      });

    }


    const paymentQuery = {

      order:
        order._id,

      user:
        req.user._id,

    };


    if (razorpayOrderId) {

      paymentQuery.razorpayOrderId =
        razorpayOrderId;

    }


    const payment =
      await Payment.findOne(
        paymentQuery
      );


    if (payment) {

      payment.status =
        "failed";

      payment.failureReason =
        reason ||
        "Payment failed";

      payment.failureCode =
        code || "";

      await payment.save();

    }

    if (
      order.paymentStatus !==
      "completed"
    ) {

      order.paymentStatus =
        "failed";

      if (
        order.orderStatus ===
        "PENDING"
      ) {

        order.orderStatus =
          "PENDING";

      }

      await order.save();

    }


    return res.json({

      success: true,

      message:
        "Payment failure recorded",

    });


  } catch (error) {

    console.error(
      "Payment Failed Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to record payment failure",

    });

  }

};


const paymentSuccessPage = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.orderId,

        user:
          req.user._id,

      })
      .populate(
        "items.product"
      );


    if (!order) {

      return res.status(404).send(
        "Order not found"
      );

    }


    return res.render(
      "payment/success",
      {
        order,
      }
    );


  } catch (error) {

    console.error(
      "Payment Success Page Error:",
      error
    );


    return res.status(500).send(
      "Unable to load payment success page"
    );

  }

};

const paymentFailedPage = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.orderId,

        user:
          req.user._id,

      })
      .populate(
        "items.product"
      );


    if (!order) {

      return res.status(404).send(
        "Order not found"
      );

    }


    return res.render(
      "payment/failed",
      {
        order,
      }
    );


  } catch (error) {

    console.error(
      "Payment Failed Page Error:",
      error
    );


    return res.status(500).send(
      "Unable to load payment failed page"
    );

  }

};


const handleWebhook = async (
  req,
  res
) => {

  try {

    const signature =
      req.headers[
        "x-razorpay-signature"
      ];


    if (!signature) {

      return res.status(400).send(
        "Missing webhook signature"
      );

    }

    const rawBody =
      req.body;


    if (
      !Buffer.isBuffer(rawBody)
    ) {

      return res.status(400).send(
        "Webhook body must be raw"
      );

    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(rawBody)
        .digest("hex");


    const generatedBuffer =
      Buffer.from(
        generatedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        signature,
        "utf8"
      );


    if (
      generatedBuffer.length !==
      receivedBuffer.length ||
      !crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      )
    ) {

      return res.status(400).send(
        "Invalid webhook signature"
      );

    }

    const payload =
      JSON.parse(
        rawBody.toString("utf8")
      );


    const event =
      payload.event;


    const paymentEntity =
      payload.payload
        ?.payment
        ?.entity;

    if (
      event ===
      "payment.captured"
    ) {

      if (!paymentEntity) {

        return res.status(200).json({
          success: true,
        });

      }

      let payment =
        await Payment.findOne({

          razorpayPaymentId:
            paymentEntity.id,

        });

      if (
        !payment &&
        paymentEntity.order_id
      ) {

        payment =
          await Payment.findOne({

            razorpayOrderId:
              paymentEntity.order_id,

          });

      }


      if (payment) {

        payment.razorpayPaymentId =
          paymentEntity.id;

        payment.status =
          "captured";

        payment.webhookReceived =
          true;

        payment.failureReason =
          "";

        payment.failureCode =
          "";

        await payment.save();

        const order =
          await Order.findById(
            payment.order
          );


        if (order) {

          if (
            order.paymentStatus !==
            "completed"
          ) {

            order.paymentStatus =
              "completed";

            order.orderStatus =
              "CONFIRMED";

            if (
              order.paymentGateway !==
              undefined
            ) {

              order.paymentGateway =
                "RAZORPAY";

            }

            await order.save();

          }

          try {

            await adjustOrderStock(
              order
            );

          } catch (stockError) {

            console.error(
              "Webhook Stock Error:",
              stockError
            );

          }

          try {

            await clearUserCart(
              order
            );

          } catch (cartError) {

            console.error(
              "Webhook Cart Clear Error:",
              cartError
            );

          }

        }

      }

    }


    if (
      event ===
      "payment.failed"
    ) {

      if (!paymentEntity) {

        return res.status(200).json({
          success: true,
        });

      }


      let payment =
        await Payment.findOne({

          razorpayPaymentId:
            paymentEntity.id,

        });


      if (
        !payment &&
        paymentEntity.order_id
      ) {

        payment =
          await Payment.findOne({

            razorpayOrderId:
              paymentEntity.order_id,

          });

      }


      if (payment) {


        payment.razorpayPaymentId =
          paymentEntity.id;

        payment.status =
          "failed";

        payment.webhookReceived =
          true;

        payment.failureReason =
          paymentEntity.error_description ||
          "Payment failed";

        payment.failureCode =
          paymentEntity.error_code ||
          "";

        await payment.save();


        const order =
          await Order.findById(
            payment.order
          );


        if (
          order &&
          order.paymentStatus !==
            "completed"
        ) {

          order.paymentStatus =
            "failed";

          await order.save();

        }

      }

    }


    return res.status(200).json({

      success: true,

    });


  } catch (error) {

    console.error(
      "Razorpay Webhook Error:",
      error
    );


    return res.status(500).send(
      "Webhook processing failed"
    );

  }

};


module.exports = {

  createPaymentOrder,

  showPaymentPage,

  verifyPayment,

  paymentFailed,

  paymentSuccessPage,

  paymentFailedPage,

  handleWebhook,

};