const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
const bcrypt = require("bcrypt");

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.body.accessToken;

  if (typeof bearerHeader !== "undefined" && bearerHeader !== null) {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[0];

    req.token = bearerToken;
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.send({ message: "jwt expired" });
      } else {
        req.user = user;
      }
      next();
    });
    // next();
  } else {
    return res.send({ message: "jwt expired" });
  }
};
