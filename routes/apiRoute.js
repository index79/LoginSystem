import express from "express";
import { authMiddleware } from "../helpers/middlewares.js";
const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.send("<ul><br>Sucess,<br><a href='/logout'>logout</a></ul>");
});

export default router;
