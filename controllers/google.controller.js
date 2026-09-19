const jwt = require("jsonwebtoken");

const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        "/auth/login?error=google_auth_failed"
      );
    }

    const user = req.user;

    if (user.isBlocked) {
      return res.redirect(
        "/auth/login?error=account_blocked"
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured"
      );

      return res.redirect(
        "/auth/login?error=server_error"
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge:
        24 *
        60 *
        60 *
        1000,
      path: "/",
    });

    return res.redirect("/");
  } catch (error) {
    console.error(
      "Google Callback Error:",
      error
    );

    return res.redirect(
      "/auth/login?error=google_auth_failed"
    );
  }
};

const googleFailure = (req, res) => {
  return res.redirect(
    "/auth/login?error=google_auth_failed"
  );
};

const logout = (req, res) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  return res.redirect("/auth/login");
};

module.exports = {
  googleCallback,
  googleFailure,
  logout,
};