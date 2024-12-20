const jwt = require("jsonwebtoken");
const SECRET_KEY = "this is the new app "; // Store securely in an environment variable

const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Ensure the Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY); // Pass the token as the first argument and the secret key as the second
    req.user = decoded.user; // Attach the decoded payload (user data) to the request object
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = { validateToken };
