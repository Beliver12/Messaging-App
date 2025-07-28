const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken');
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
const bcrypt = require('bcrypt');


exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.body.accessToken;

  if (typeof bearerHeader !== 'undefined' && bearerHeader !== null) {
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[0];

    req.token = bearerToken;
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        req.user = user;
      }
      next();
    });
    // next();
  } else {
    return res.send({ message: 'jwt expired' });
  }
};

exports.signupUserPost = async (req, res) => {
 
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const email = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (req.body.password !== req.body.password2) {
    return res.status(400).send({
      error: "Passwords dont match ",
    });
  }
  if (user) {
    return res.status(400).send({
      error: "Username allready in use!",
    });
  }
  if (email) {
    return res.status(400).send({
      error: "Email allready in use",
    });
  }

  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }



    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        about: req.body.about,
        image: req.file.filename
      },
    });
  });
  res.status(200).send({ message: "Signup successful!" });
};

exports.loginUserPost = async (req, res) => {

  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if(!user) {
    return res.status(400).send({error: 'Incorrect email'});
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).send({ error: 'Incorrect password' });
  }
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  jwt.sign(
    { user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '3600s' },
    (err, token) => {
      res.json({
        user,
        token,
        refreshToken,
      });
    }
  );
}