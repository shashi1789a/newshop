// ======================================================
// GOOGLE AUTHENTICATION
// ======================================================

router.get(
  "/google",

  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
    ],
    session: false,
  })
);


router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect:
      "/auth/login?error=google_auth_failed",

    session: false,
  }),

  googleController.googleCallback
);