const Product = require("../models/product.model");
const OldCloth = require("../models/oldCloth.model");
const Order = require("../models/Order");
const User = require("../models/User");

exports.dashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const totalProducts = await Product.countDocuments({
      seller: sellerId,
    });

    const activeProducts = await Product.countDocuments({
      seller: sellerId,
      isActive: true,
    });

    const inactiveProducts = await Product.countDocuments({
      seller: sellerId,
      isActive: false,
    });

    const totalOldClothes = await OldCloth.countDocuments({
      seller: sellerId,
    });

    const activeOldClothes = await OldCloth.countDocuments({
      seller: sellerId,
      status: "active",
    });

    const totalOrders = await Order.countDocuments({
      "items.seller": sellerId,
    });

    const pendingOrders = await Order.countDocuments({
      "items.seller": sellerId,
      status: "pending",
    });

    const shippedOrders = await Order.countDocuments({
      "items.seller": sellerId,
      status: "shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      "items.seller": sellerId,
      status: "delivered",
    });

    const salesResult = await Order.aggregate([
      {
        $match: {
          "items.seller": sellerId,
          status: "delivered",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.seller": sellerId,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $multiply: [
                "$items.price",
                "$items.quantity",
              ],
            },
          },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    const recentProducts = await Product.find({
      seller: sellerId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOldClothes = await OldCloth.find({
      seller: sellerId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.render("seller/dashboard", {
      user: req.user,

      totalProducts,
      activeProducts,
      inactiveProducts,

      totalOldClothes,
      activeOldClothes,

      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,

      totalSales,

      recentProducts,
      recentOldClothes,
    });

  } catch (error) {
    console.error(
      "Seller Dashboard Error:",
      error
    );

    return res.status(500).send(
      "Unable to load seller dashboard"
    );
  }
};

exports.myProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const {
      type = "all",
      search,
      status,
    } = req.query;

    let productQuery = {
      seller: sellerId,
    };

    if (status === "active") {
      productQuery.isActive = true;
    }

    if (status === "inactive") {
      productQuery.isActive = false;
    }

    if (search) {
      productQuery.name = new RegExp(
        search,
        "i"
      );
    }

    let products = [];

    if (
      type === "all" ||
      type === "new" ||
      type === "product"
    ) {
      products = await Product.find(
        productQuery
      )
        .sort({ createdAt: -1 });
    }

    let oldClothes = [];

    if (
      type === "all" ||
      type === "old"
    ) {
      const oldQuery = {
        seller: sellerId,
      };

      if (status) {
        oldQuery.status = status;
      }

      if (search) {
        oldQuery.$or = [
          {
            category: new RegExp(
              search,
              "i"
            ),
          },
          {
            brand: new RegExp(
              search,
              "i"
            ),
          },
        ];
      }

      oldClothes = await OldCloth.find(
        oldQuery
      )
        .sort({ createdAt: -1 });
    }

    return res.render(
      "seller/my-products",
      {
        user: req.user,

        products,
        oldClothes,

        type,
        search: search || "",
        status: status || "",
      }
    );

  } catch (error) {
    console.error(
      "Seller My Products Error:",
      error
    );

    return res.status(500).send(
      "Unable to load seller products"
    );
  }
};

exports.addProduct = async (req, res) => {
  try {
    return res.render(
      "seller/add-product",
      {
        user: req.user,
      }
    );

  } catch (error) {
    console.error(
      "Seller Add Product Page Error:",
      error
    );

    return res.status(500).send(
      "Unable to open add product page"
    );
  }
};

exports.editProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const product =
      await Product.findOne({
        _id: req.params.id,
        seller: sellerId,
      });

    if (!product) {
      return res.status(404).render(
        "404",
        {
          title: "Product Not Found",
          message:
            "Product not found or you do not have permission to edit it.",
        }
      );
    }

    return res.render(
      "products/edit",
      {
        title: "Edit Product",
        product,
        user: req.user,
      }
    );

  } catch (error) {
    console.error(
      "Seller Edit Product Error:",
      error
    );

    return res.status(500).send(
      "Unable to edit product"
    );
  }
};

exports.editOldCloth = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const cloth =
      await OldCloth.findOne({
        _id: req.params.id,
        seller: sellerId,
      });

    if (!cloth) {
      return res.status(404).render(
        "404",
        {
          title: "Old Cloth Not Found",
          message:
            "Old cloth not found or you do not have permission to edit it.",
        }
      );
    }

    return res.render(
      "oldClothes/editOldCloth",
      {
        cloth,
        user: req.user,
      }
    );

  } catch (error) {
    console.error(
      "Seller Edit Old Cloth Error:",
      error
    );

    return res.status(500).send(
      "Unable to edit old cloth"
    );
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const product =
      await Product.findOne({
        _id: req.params.id,
        seller: sellerId,
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found or you do not have permission to delete it.",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "Seller Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete product",
    });
  }
};

exports.deleteOldCloth = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const cloth =
      await OldCloth.findOne({
        _id: req.params.id,
        seller: sellerId,
      });

    if (!cloth) {
      return res.status(404).json({
        success: false,
        message:
          "Old cloth not found or you do not have permission to delete it.",
      });
    }

    await OldCloth.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      success: true,
      message:
        "Old cloth deleted successfully",
    });

  } catch (error) {
    console.error(
      "Seller Delete Old Cloth Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete old cloth",
    });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders =
      await Order.find({
        "items.seller": sellerId,
      })
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.render(
      "seller/orders",
      {
        user: req.user,
        orders,
        currentStatus: "all",
      }
    );

  } catch (error) {
    console.error(
      "Seller Orders Error:",
      error
    );

    return res.status(500).send(
      "Unable to load seller orders"
    );
  }
};

exports.pendingOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders =
      await Order.find({
        "items.seller": sellerId,
        status: "pending",
      })
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.render(
      "seller/orders",
      {
        user: req.user,
        orders,
        currentStatus: "pending",
      }
    );

  } catch (error) {
    console.error(
      "Pending Orders Error:",
      error
    );

    return res.status(500).send(
      "Unable to load pending orders"
    );
  }
};

exports.shippedOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders =
      await Order.find({
        "items.seller": sellerId,
        status: "shipped",
      })
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.render(
      "seller/orders",
      {
        user: req.user,
        orders,
        currentStatus: "shipped",
      }
    );

  } catch (error) {
    console.error(
      "Shipped Orders Error:",
      error
    );

    return res.status(500).send(
      "Unable to load shipped orders"
    );
  }
};

exports.deliveredOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders =
      await Order.find({
        "items.seller": sellerId,
        status: "delivered",
      })
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.render(
      "seller/orders",
      {
        user: req.user,
        orders,
        currentStatus: "delivered",
      }
    );

  } catch (error) {
    console.error(
      "Delivered Orders Error:",
      error
    );

    return res.status(500).send(
      "Unable to load delivered orders"
    );
  }
};

exports.updateOrderStatus = async (
  req,
  res
) => {
  try {
    const sellerId = req.user._id;

    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "pending",
      "shipped",
      "delivered",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    const order =
      await Order.findOne({
        _id: req.params.id,
        "items.seller": sellerId,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found or you do not have permission.",
      });
    }

    order.status = status;

    await order.save();

    return res.json({
      success: true,
      message:
        `Order marked as ${status}`,
      order,
    });

  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update order status",
    });
  }
};

exports.sales = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const salesData =
      await Order.aggregate([
        {
          $match: {
            "items.seller": sellerId,
            status: "delivered",
          },
        },

        {
          $unwind: "$items",
        },

        {
          $match: {
            "items.seller": sellerId,
          },
        },

        {
          $group: {
            _id: null,

            totalOrders: {
              $sum: 1,
            },

            totalItems: {
              $sum:
                "$items.quantity",
            },

            totalSales: {
              $sum: {
                $multiply: [
                  "$items.price",
                  "$items.quantity",
                ],
              },
            },
          },
        },
      ]);

    const sales =
      salesData.length > 0
        ? salesData[0]
        : {
            totalOrders: 0,
            totalItems: 0,
            totalSales: 0,
          };

    return res.render(
      "seller/sales",
      {
        user: req.user,
        sales,
      }
    );

  } catch (error) {
    console.error(
      "Seller Sales Error:",
      error
    );

    return res.status(500).send(
      "Unable to load sales"
    );
  }
};

exports.profile = async (req, res) => {
  try {
    const seller =
      await User.findById(
        req.user._id
      ).select(
        "-password"
      );

    if (!seller) {
      return res.status(404).send(
        "Seller not found"
      );
    }

    return res.render(
      "seller/profile",
      {
        user: seller,
      }
    );

  } catch (error) {
    console.error(
      "Seller Profile Error:",
      error
    );

    return res.status(500).send(
      "Unable to load profile"
    );
  }
};

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const seller =
      await User.findById(
        req.user._id
      );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message:
          "Seller not found",
      });
    }

    const {
      name,
      phone,
      address,
    } = req.body;

    if (name) {
      seller.name = name;
    }

    if (phone) {
      seller.phone = phone;
    }

    if (address) {
      seller.address = address;
    }

    await seller.save();

    return res.json({
      success: true,
      message:
        "Profile updated successfully",
      user: seller,
    });

  } catch (error) {
    console.error(
      "Update Seller Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
};

