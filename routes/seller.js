const express = require("express");

const router = express.Router();

const {
  auth,
  sellerAuth,
} = require("../middleware/auth");

const sellerController =
  require("../controllers/seller.controller");

router.get(
  "/",
  auth,
  sellerAuth,
  sellerController.dashboard
);

router.get(
  "/dashboard",
  auth,
  sellerAuth,
  sellerController.dashboard
);

router.get(
  "/products",
  auth,
  sellerAuth,
  sellerController.myProducts
);

router.get(
  "/products/add",
  auth,
  sellerAuth,
  sellerController.addProduct
);

router.get(
  "/products/edit/:id",
  auth,
  sellerAuth,
  sellerController.editProduct
);

router.get(
  "/old-clothes/edit/:id",
  auth,
  sellerAuth,
  sellerController.editOldCloth
);

router.delete(
  "/products/:id",
  auth,
  sellerAuth,
  sellerController.deleteProduct
);

router.delete(
  "/old-clothes/:id",
  auth,
  sellerAuth,
  sellerController.deleteOldCloth
);

router.get(
  "/orders",
  auth,
  sellerAuth,
  sellerController.myOrders
);

router.get(
  "/orders/pending",
  auth,
  sellerAuth,
  sellerController.pendingOrders
);

router.get(
  "/orders/shipped",
  auth,
  sellerAuth,
  sellerController.shippedOrders
);

router.get(
  "/orders/delivered",
  auth,
  sellerAuth,
  sellerController.deliveredOrders
);

router.patch(
  "/orders/:id/status",
  auth,
  sellerAuth,
  sellerController.updateOrderStatus
);

router.get(
  "/sales",
  auth,
  sellerAuth,
  sellerController.sales
);

router.get(
  "/profile",
  auth,
  sellerAuth,
  sellerController.profile
);

router.put(
  "/profile",
  auth,
  sellerAuth,
  sellerController.updateProfile
);


module.exports = router;