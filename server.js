const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

const path = require("path");

const session = require("express-session");

const methodOverride = require("method-override");

const connectDB = require("./config/db");
const { MongoStore } = require("connect-mongo");

// ======================================================
// CONFIG
// ======================================================

dotenv.config();

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// DATABASE CONNECTION
// ======================================================
connectDB();

// ======================================================
// MIDDLEWARES
// ======================================================

// BODY PARSER
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// COOKIE PARSER
app.use(cookieParser());

// METHOD OVERRIDE
app.use(
  methodOverride("_method")
);


app.set("trust proxy", 1);
// SESSION
app.use(
  session({

    secret:
      process.env.SESSION_SECRET ||
      "secretkey",

    resave: false,

    saveUninitialized: false,

     store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
  }),

    cookie: {

      maxAge:
        1000 *
        60 *
        60 *
        24,

      httpOnly: true,

      secure: process.env.NODE_ENV === "production",
    },
  })
);

// ======================================================
// GLOBAL USER
// ======================================================

app.use((req, res, next) => {

  res.locals.user = req.user || null;

  next();

});

// ======================================================
// VIEW ENGINE
// ======================================================

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

// ======================================================
// STATIC FILES
// ======================================================

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

// ======================================================
// ROUTES IMPORT
// ======================================================

// AUTH ROUTES
const authRoutes =
  require("./routes/auth");

// INDEX ROUTES
const indexRoutes =
  require("./routes/index");

// ORDER ROUTES
const orderRoutes =
  require("./routes/orders");

// PRODUCT ROUTES
const productRoutes =
  require("./routes/products");

// WISHLIST ROUTES
const wishlistRoutes =
  require("./routes/wishlist");

// ADMIN AUTH ROUTES
const adminAuthRoutes =
  require("./routes/adminAuth");

// OLD CLOTH ROUTES
const oldClothRoutes =
  require("./routes/oldCloth.routes");

// ======================================================
// USE ROUTES
// ======================================================

app.use("/", indexRoutes);

app.use("/auth", authRoutes);

app.use("/orders", orderRoutes);

app.use("/products", productRoutes);

app.use("/wishlist", wishlistRoutes);

app.use("/", adminAuthRoutes);

app.use(
  "/old-clothes",
  oldClothRoutes
);

// ======================================================
// HOME TEST ROUTE
// ======================================================

app.get("/health", (req, res) => {

  res.send(
    "Server Working Fine"
  );

});

// ======================================================
// 404 PAGE
// ======================================================

app.use((req, res) => {

  res.status(404).render(
    "404",
    {
      title:
        "Page Not Found",
    }
  );

});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err.stack);

    res.status(500).send(
      "Something Went Wrong"
    );

  }
);

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});