import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

// Define user model
const User = mongoose.model("User", userSchema);

export { User };
