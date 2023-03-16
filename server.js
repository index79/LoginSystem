import express from "express";
import initializePassport from "./helpers/passport.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import apiRouter from "./routes/apiRoute.js";
import { config } from "dotenv";
config({ path: "./config/.env" });
import SessionCleanup from "./helpers/sessionCleanup.js";
import cron from "node-cron";

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) =>
    console.log("Error connecting to database:", error.message)
  );

// Middleware
app.use(cookieParser());
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
initializePassport();

// Define session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // Session will expire after 14 days
    }),
  })
);

app.set("view engine", "ejs");
// Schedule SessionCleanup to run every day at 3am
cron.schedule("0 3 * * *", SessionCleanup);
// Authentication
app.use("/", authRouter);
// Api (protected area)
app.use("/api", apiRouter);
// Start server
app.listen(3000, () => console.log("Server started on port 3000"));
