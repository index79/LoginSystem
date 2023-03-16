import passport from "passport";
import firebaseAdmin from "firebase-admin";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { User } from "../models/user.js";

config({ path: "./config/.env" });

const initializePassport = () => {
  // Serialize user into session
  passport.serializeUser((user, done) => {
    done(null, user.uid);
  });

  // Deserialize user from session
  passport.deserializeUser(async (uid, done) => {
    try {
      // Fetch user from Firebase Auth using uid
      const user = await firebaseAdmin.auth().getUser(uid);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Define Passport strategy for Google OAuth2.0
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALL_BACK,
        session: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists in MongoDB
          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            done(null, user);
          } else {
            // If user does not exist, create a new user in MongoDB
            const newUser = new User({
              email: profile.emails[0].value,
              passwordHash: Math.random().toString(36).substring(2, 15),
            });
            user = await newUser.save();
            done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Setup passport local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Incorrect email." });
            }
            bcrypt.compare(password, user.passwordHash, (err, res) => {
              if (err) {
                return done(err);
              }
              if (res) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect password." });
              }
            });
          })
          .catch((error) => {
            return done(error);
          });
      }
    )
  );
  //
};

export default initializePassport;
