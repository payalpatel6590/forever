import jwt from "jsonwebtoken";

const verifyToken = (req) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Not Authorized");
  }

  const token = authorization.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const authUser = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const authAdmin = (req, res, next) => {
  try {
    const decoded = verifyToken(req);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const authSeller = (req, res, next) => {
  try {
    const decoded = verifyToken(req);

    if (decoded.role !== "seller" && decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Seller only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};