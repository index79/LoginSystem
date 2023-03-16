import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { generateTokens } from "../helpers/middlewares.js";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { title: "Login" });
});

// User Login
router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      // User authenticated successfully, generate JWT tokens
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    generateTokens(req, res);
    // Redirect to authorized page
    res.redirect("/api");
  }
);

// User Signup
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  // Check if email and password are not null or undefined
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }
  // Hash the password using bcrypt
  bcrypt
    .hash(password, 10)
    .then((passwordHash) => {
      // Create new user document and save to database
      const user = new User({ email, passwordHash });
      return user.save();
    })
    .then(() => {
      console.log(`User account created successfully: ${email}`);
      res.status(201).send("User account created successfully");
    })
    .catch((error) => {
      console.error(`Error creating user account: ${error}`);
      res.status(400).send("Error creating user account");
    });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    if (
      !req.session.accessToken &&
      !req.session.refreshToken &&
      !req.session.user
    ) {
      // Generate access token
      generateTokens(req, res);
    }
    // Redirect to authorized page
    res.redirect("/api");
  }
);

// Retrieve session data
router.get("/profile", function (req, res) {
  if (req.session) res.send(JSON.stringify(req.session));
});

// Destroy session
router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

export default router;
