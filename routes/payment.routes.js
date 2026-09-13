const express = require("express");

const router = express.Router();

const { auth } =
  require("../middleware/auth");

const {

  createPaymentOrder,

  showPaymentPage,

  verifyPayment,

  paymentFailed,

  paymentSuccessPage,

  paymentFailedPage,

  handleWebhook,

} =
  require("../controllers/payment.controller");

router.get(
  "/checkout/:orderId",
  auth,
  showPaymentPage
);

router.post(
  "/create-order/:orderId",
  auth,
  createPaymentOrder
);

router.post(
  "/verify",
  auth,
  verifyPayment
);

router.post(
  "/failed",
  auth,
  paymentFailed
);

router.get(
  "/success/:orderId",
  auth,
  paymentSuccessPage
);

router.get(
  "/failed/:orderId",
  auth,
  paymentFailedPage
);

router.post(
  "/webhook",
  handleWebhook
);


module.exports = router;