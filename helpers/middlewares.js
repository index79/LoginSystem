import jwt from "jsonwebtoken";

function generateTokens(req, res) {
  const accessToken = jwt.sign(
    { uid: req.user.uid },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10m" }
  );
  // Generate refresh token
  const refreshToken = jwt.sign(
    { uid: req.user.uid },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );
  // Set session data with expiration time for tokens
  req.session.accessToken = {
    token: accessToken,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  req.session.refreshToken = {
    token: refreshToken,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  // Store user data in session
  req.session.user = {
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
  };
  // Save session
  req.session.save();
}

function authMiddleware(req, res, next) {
  const accessToken = req.session.accessToken?.token;
  if (!accessToken) {
    return res.redirect("/");
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const refreshToken = req.session.refreshToken.token;
      if (!refreshToken) {
        return res.redirect("/");
      }
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET_KEY
        );
        const newAccessToken = jwt.sign(
          { uid: decoded.uid },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "10m" }
        );
        req.session.accessToken.token = newAccessToken;
        req.uid = decoded.uid;
        next();
      } catch (err) {
        return res.redirect("/");
      }
    } else {
      return res.redirect("/");
    }
  }
}

export { generateTokens, authMiddleware };
