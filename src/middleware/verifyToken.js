import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const { authToken } = req.cookies;

  if (!authToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.userId; // Set req.userId from decoded token
    next();
  });
}

export default verifyToken;
