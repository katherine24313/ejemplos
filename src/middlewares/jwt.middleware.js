import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ Error: "Token not provider" });
    }

    token = token.split(" ")[1];
    const { email } = jwt.verify(token, process.env.JWK_SECRET);

    console.log(email);
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Invalid Token not provided" + error.message
    });
  }
};

export default verifyToken;