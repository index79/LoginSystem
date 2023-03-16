import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  accessToken: {
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  refreshToken: {
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  user: {
    email: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);

export { Session };
