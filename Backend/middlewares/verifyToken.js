const jwt = require("jsonwebtoken");
const fs = require("fs");

const PUBLIC_KEY = fs.readFileSync("./public.key", "utf8");

module.exports = async (req, res, next) => {
  const header = req.header("Authorization");

  if (!header) {
    return res.status(403).send("No token, access denied.");
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(400).send("Invalid Authorization Header.");
  }

  try {
    const payload = await jwt.verify(token, PUBLIC_KEY, {
      issuer: "Petish Backend",
      audience: "Petish Frontend",
      expiresIn: "12h",
      algorithm: ["RS256"]
    });

    req.tokenPayload = payload;
    return next();
  } catch (err) {
    return res.status(400).send(err);
  }
};
