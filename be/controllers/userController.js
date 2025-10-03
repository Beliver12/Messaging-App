const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { getIO } = require("../socket");

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
        image: req.file.filename,
      },
    });
  });

  res.status(200).send({ message: "Signup successful!" });
};

exports.loginUserPost = async (req, res) => {
  let user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(400).send({ error: "Incorrect email" });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).send({ error: "Incorrect password" });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isOnline: "true",
    },
  });

  user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });



  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  jwt.sign(
    { user },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "365d" },
    (err, token) => {
      res.json({
        user,
        token,
        refreshToken,
      });
    },
  );
};

exports.logOut = async (req, res) => {

  
  await prisma.user.update({
    where: {
      id: req.user.user.id,
    },
    data: {
      isOnline: "false",
    },
  });
  return res.send({ message: "loged out" });
};

exports.usersPost = async (req, res) => {
  const addedUsers = await prisma.friends.findMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
        },
        {
          friendId: req.user.user.id,
        },
      ],
    },
  });

  const addedFriends = addedUsers.map((user) => user.friendId);
  const addedFriends2 = addedUsers.map((user) => user.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: [req.user.user.id, ...addedFriends, ...addedFriends2],
      },
    },
  });

  return res.send(users);
};

exports.checkUserProfilePost = async (req, res) => {
  const id = Number(req.body.userId);
  const user = await prisma.user.findMany({
    where: {
      id: id,
    },
  });
  return res.send(user);
};

exports.editUserProfile = async (req, res) => {
  const io = getIO();
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
      NOT: {
        id: req.user.user.id,
      },
    },
  });

  if (user) {
    return res.status(400).send({
      error: "Username allready in use!",
    });
  }
  if (req.file) {
    await prisma.user.update({
      where: {
        id: req.user.user.id,
      },
      data: {
        about: req.body.about,
        username: req.body.username,
        image: req.file.filename,
        isOnline: req.body.online,
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: req.user.user.id,
      },
      data: {
        about: req.body.about,
        username: req.body.username,
        isOnline: req.body.online,
      },
    });
  }

  const editedUser = await prisma.user.findUnique({
    where: {
      id: req.user.user.id,
    },
  });

  io.emit("getStatusOfAllUsersInChat");
  res.status(200).send({ message: "Edit successful!", user: editedUser });
};

exports.verifyUserToken = async (req, res) => {
  if (req.user) {
    return res.send({ message: "jwt alive" });
  }
  return res.send({ message: "jwt expired" });
};
