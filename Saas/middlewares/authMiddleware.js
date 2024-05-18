import jwt from "jsonwebtoken";

export const verifyWithId = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // console.log('Token:', token);
  // console.log('JWT Secret:', process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.log(err);
      return res
        .status(401)
        .json({ success: false, error: "Failed to authenticate token" });
    }
    req.body.id = decoded.id;
    next();
  });
};

export const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // console.log('Token:', token);
  // console.log('JWT Secret:', process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.log(err);
      return res
        .status(401)
        .json({ success: false, error: "Failed to authenticate token" });
    }
    next();
  });
};
