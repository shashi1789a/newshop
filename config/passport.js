require("dotenv").config();

const passport = require("passport");
const GoogleStrategy =
  require("passport-google-oauth20").Strategy;
const crypto = require("crypto");

const User = require("../models/User");

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(
    "GOOGLE_CLIENT_ID is not configured"
  );
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_SECRET is not configured"
  );
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  throw new Error(
    "GOOGLE_CALLBACK_URL is not configured"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        process.env.GOOGLE_CALLBACK_URL,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const googleId = profile.id;

        const email =
          profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase();

        const name =
          profile.displayName?.trim() ||
          "Google User";

        const profileImage =
          profile.photos?.[0]?.value || "";

        if (!googleId) {
          return done(
            new Error(
              "Google account ID not received"
            ),
            null
          );
        }

        if (!email) {
          return done(
            new Error(
              "Google account email not available"
            ),
            null
          );
        }

        let user = await User.findOne({
          googleId,
        });

        if (user) {
          if (user.isBlocked) {
            return done(
              new Error(
                "Your account has been blocked"
              ),
              null
            );
          }

          if (
            profileImage &&
            user.profileImage !== profileImage
          ) {
            user.profileImage =
              profileImage;

            await user.save();
          }

          return done(null, user);
        }

        user = await User.findOne({
          email,
        });

        if (user) {
          if (user.isBlocked) {
            return done(
              new Error(
                "Your account has been blocked"
              ),
              null
            );
          }

          user.googleId = googleId;

          if (
            profileImage &&
            !user.profileImage
          ) {
            user.profileImage =
              profileImage;
          }

          user.isVerified = true;

          await user.save();

          return done(null, user);
        }

        const randomPassword =
          crypto
            .randomBytes(32)
            .toString("hex");

        user = new User({
          name,
          email,
          password: randomPassword,
          googleId,
          profileImage,
          phone: "",
          role: "user",
          isVerified: true,
        });

        await user.save();

        return done(null, user);
      } catch (error) {
        console.error(
          "Google Passport Error:",
          error
        );

        return done(error, null);
      }
    }
  )
);

module.exports = passport;