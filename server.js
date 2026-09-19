const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");

const connectDB = require("./config/db");
const { MongoStore } = require("connect-mongo");


const { optionalAuth } = require("./middleware/auth");

dotenv.config();
require("./config/passport");

const app = express();

connectDB();

app.set("trust proxy", 1);

app.use("/payment/webhook", express.raw({ type: "application/json",}));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(
  methodOverride("_method")
);

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "secretkey",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({

      mongoUrl:
        process.env.MONGODB_URI,

      collectionName:
        "sessions",

    }),

    cookie: {

      maxAge:
        1000 *
        60 *
        60 *
        24,

      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

    },

  })
);


app.use(optionalAuth);

app.set(
  "view engine",
  "ejs"
);

app.set(
  "views",
  path.join(
    __dirname,
    "views"
  )
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);


const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const orderRoutes = require("./routes/orders");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist");
const adminAuthRoutes = require("./routes/adminAuth");
const oldClothRoutes = require("./routes/oldCloth.routes");
const ownerRoutes = require("./routes/seller");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment.routes");
const sellerRoutes = require("./routes/seller");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist",wishlistRoutes);
app.use("/",adminAuthRoutes);
app.use("/owner", ownerRoutes);
app.use("/payment",paymentRoutes);
app.use("/old-clothes",oldClothRoutes);
app.use("/seller", sellerRoutes);


app.get(
  "/health",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Server Working Fine",

    });

  }
);



const {
  errorHandler,
} = require("./middleware/error.middleware");

app.use(errorHandler);



app.use(
  (req, res) => {

    res.status(404).json({

      statusCode: 404,

      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`,

      data: null,

      errors: [],

    });

  }
);


const PORT =
  process.env.PORT ||
  5000;

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);