const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/product.model");

const { auth } = require("../middleware/auth");
const authadmin = require("../middleware/authadmin");

const methodOverride = require("method-override");

router.use(methodOverride("_method"));

router.get("/order", auth, async (req, res) => {
  try {

    if (req.query.productid) {

      const product = await Product.findOne({
        _id: req.query.productid,
        isActive: true,
      });

      if (!product) {
        return res.redirect("/cart");
      }

      if (!product.stock || product.stock <= 0) {
        return res.status(400).send(
          "Product is out of stock"
        );
      }

      return res.render("orders/order", {
        product,
        cart: null,
        user: req.user,
      });
    }

    const user = await User.findOne({
      email: req.user.email,
    }).populate("cart.product");

    if (!user) {
      return res.status(404).send(
        "User not found"
      );
    }


    if (!user.cart || user.cart.length === 0) {
      return res.redirect("/cart");
    }

    const validCart = user.cart.filter(
      item => item.product
    );


    if (validCart.length === 0) {

      user.cart = [];

      await user.save();

      return res.redirect("/cart");
    }

    return res.render("orders/order", {
      product: null,
      cart: validCart,
      user,
    });

  } catch (error) {

    console.error(
      "Order Page Error:",
      error
    );

    return res.redirect("/cart");
  }
});

router.post("/order", auth, async (req, res) => {
  try {

    const user = await User.findOne({
      email: req.user.email,
    }).populate("cart.product");


    if (!user) {
      return res.status(404).send(
        "User not found"
      );
    }

    const paymentMethod = String(
      req.body.paymentMethod || "COD"
    )
      .trim()
      .toUpperCase();

    const allowedPaymentMethods = [
      "COD",
      "RAZORPAY",
    ];


    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {

      return res.status(400).send(
        `Invalid payment method: ${paymentMethod}`
      );

    }

    const items = [];

    let subtotal = 0;

    let isSingleProduct = false;

    if (req.body.productid) {

      isSingleProduct = true;


      const product = await Product.findOne({
        _id: req.body.productid,
        isActive: true,
      });


      if (!product) {
        return res.redirect("/cart");
      }

      const quantity = Math.max(
        parseInt(req.body.quantity) || 1,
        1
      );

      if (
        !product.stock ||
        product.stock < quantity
      ) {

        return res.status(400).send(
          `${product.name} has only ${product.stock || 0} item(s) available`
        );

      }

      items.push({
        product: product._id,
        quantity,
        price: Number(product.price),
      });

      subtotal =
        Number(product.price) *
        quantity;

    }

    else {

      if (
        !user.cart ||
        user.cart.length === 0
      ) {

        return res.redirect("/cart");

      }

      for (
        const cartItem of user.cart
      ) {

        const product =
          cartItem.product;

        if (!product) {
          continue;
        }

        const quantity = Math.max(
          Number(cartItem.quantity) || 1,
          1
        );

        if (
          !product.stock ||
          product.stock < quantity
        ) {

          return res.status(400).send(
            `${product.name} has only ${product.stock || 0} item(s) available`
          );

        }

        items.push({
          product: product._id,
          quantity,
          price: Number(product.price),
        });

        subtotal +=
          Number(product.price) *
          quantity;
      }

      if (items.length === 0) {

        return res.redirect("/cart");

      }
    }

    const shippingCharge =
      subtotal >= 999
        ? 0
        : 50;

    const totalAmount =
      subtotal +
      shippingCharge;

    const {
      name,
      street,
      locality,
      city,
      state,
      zipCode,
      phone,
      deliveryDate,
      timeSlot,
    } = req.body;

    if (
      !name ||
      !street ||
      !locality ||
      !zipCode ||
      !phone
    ) {

      return res.status(400).send(
        "Complete shipping address is required"
      );

    }

    const order = await Order.create({

      user: user._id,

      items,

      shippingAddress: {

        name: name.trim(),

        street: street.trim(),

        locality: locality.trim(),

        city: city
          ? city.trim()
          : "",

        state: state
          ? state.trim()
          : "",

        zipCode: zipCode.trim(),

        phone: phone.trim(),
      },

      deliveryDate:
        deliveryDate || "",

      timeSlot:
        timeSlot || "",

      subtotal,

      shippingCharge,

      totalAmount,

      paymentMethod,

      paymentStatus: "pending",

      paymentGateway:
        paymentMethod === "RAZORPAY"
          ? "RAZORPAY"
          : "COD",

      orderStatus:
        paymentMethod === "RAZORPAY"
          ? "PENDING"
          : "PLACED",

      checkoutType:
        isSingleProduct
          ? "SINGLE_PRODUCT"
          : "CART",

      stockAdjusted: false,
    });

    if (paymentMethod === "COD") {

      for (const item of items) {

        const product =
          await Product.findById(
            item.product
          );


        if (!product) {
          continue;
        }


        product.stock = Math.max(
          Number(product.stock) -
          Number(item.quantity),
          0
        );


        await product.save();
      }

      order.stockAdjusted = true;

      await order.save();

      if (!isSingleProduct) {

        user.cart = [];

        await user.save();

      }

      return res.redirect(
        `/orders/${order._id}`
      );
    }

    if (paymentMethod === "RAZORPAY") {

      return res.redirect(
        `/payment/checkout/${order._id}`
      );

    }


  } catch (error) {

    console.error(
      "Order Placement Error:",
      error
    );


    return res.status(500).send(
      "Unable to place order"
    );
  }
});

router.get(
  "/adminOrders",
  authadmin,
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .populate(
            "user",
            "email"
          )
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1
          });


      return res.render(
        "adminOrders",
        {
          orders,
        }
      );


    } catch (error) {

      console.error(
        "Admin Orders Error:",
        error
      );


      return res.status(500).send(
        "Server error"
      );

    }
  }
);

router.patch(
  "/:id/status",
  authadmin,
  async (req, res) => {

    try {

      const {
        orderStatus,
        paymentStatus,
        trackingNumber,
      } = req.body;


      const updateData = {};

      const allowedOrderStatuses = [
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
      ];


      if (
        orderStatus &&
        allowedOrderStatuses.includes(
          orderStatus
        )
      ) {

        updateData.orderStatus =
          orderStatus;

      }

      const allowedPaymentStatuses = [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
      ];


      if (
        paymentStatus &&
        allowedPaymentStatuses.includes(
          paymentStatus
        )
      ) {

        updateData.paymentStatus =
          paymentStatus;

      }

      if (
        typeof trackingNumber !==
        "undefined"
      ) {

        updateData.trackingNumber =
          String(
            trackingNumber
          ).trim();

      }

      await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          runValidators: true,
        }
      );


      return res.redirect(
        "/orders/adminOrders"
      );


    } catch (error) {

      console.error(
        "Order Update Error:",
        error
      );


      return res.status(500).send(
        "Failed to update order"
      );

    }
  }
);

router.delete(
  "/:id",
  authadmin,
  async (req, res) => {

    try {

      await Order.findByIdAndDelete(
        req.params.id
      );


      return res.redirect(
        "/orders/adminOrders"
      );


    } catch (error) {

      console.error(
        "Order Delete Error:",
        error
      );


      return res.status(500).send(
        "Failed to delete order"
      );

    }
  }
);

router.get(
  "/userOrders",
  auth,
  async (req, res) => {

    try {

      const orders =
        await Order.find({
          user: req.user._id,
        })
        .populate(
          "items.product"
        )
        .sort({
          createdAt: -1,
        });


      return res.render(
        "orders/userOrders",
        {
          orders,
        }
      );


    } catch (error) {

      console.error(
        "User Orders Error:",
        error
      );


      return res.status(500).send(
        "Server error"
      );

    }
  }
);

router.get(
  "/:id",
  auth,
  async (req, res) => {

    try {

      const order =
        await Order.findOne({

          _id: req.params.id,

          user: req.user._id,

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
        "orders/details",
        {
          order,
        }
      );


    } catch (error) {

      console.error(
        "Order Details Error:",
        error
      );


      return res.status(500).send(
        "Unable to load order"
      );

    }
  }
);

router.post(
  "/:id/cancel",
  auth,
  async (req, res) => {

    try {

      const order =
        await Order.findOne({

          _id: req.params.id,

          user: req.user._id,

        });


      if (!order) {

        return res.status(404).send(
          "Order not found"
        );

      }

      if (
        [
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
        ].includes(
          order.orderStatus
        )
      ) {

        return res.status(400).send(
          "This order cannot be cancelled"
        );

      }

      order.orderStatus =
        "CANCELLED";


      await order.save();

      return res.redirect(
        `/orders/${order._id}`
      );


    } catch (error) {

      console.error(
        "Cancel Order Error:",
        error
      );


      return res.status(500).send(
        "Unable to cancel order"
      );

    }
  }
);



module.exports = router;