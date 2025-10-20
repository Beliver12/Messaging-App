const { PrismaClient } = require("@prisma/client");
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

exports.addFriendsPost = async (req, res) => {
  const io = getIO();
  const id = Number(req.body.friendId);

  await prisma.friends.create({
    data: {
      friendId: id,
      status: "pending",
      userId: req.user.user.id,
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: req.user.user.id },
  });

  const friend = await prisma.user.findUnique({
    where: { id: id },
  });

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

  const sockets = await io.in(`user:${friend.username}`).fetchSockets();
  sockets.forEach((socket) => {
    socket.emit("newFriendRequest", {
      id: currentUser.id,
      username: currentUser.username,
      users: users,
    });
  });

  const friendInvites = await prisma.friends.findMany({
    where: {
      friendId: id,
      status: "pending",
    },
  });

  const notifications = friendInvites.map((friend) => friend.userId);

  const newNotifications = await prisma.user.findMany({
    where: {
      id: {
        in: [...notifications],
      },
    },
  });

  sockets.forEach((socket) => {
    socket.emit("newNotification", {
      users: newNotifications,
    });
  });

  res.status(200).send({ message: "Friend invite sent", users: users });
};

exports.notificationPost = async (req, res) => {
  const friendInvites = await prisma.friends.findMany({
    where: {
      friendId: req.user.user.id,
      status: "pending",
    },
  });

  const notifications = friendInvites.map((friend) => friend.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...notifications],
      },
    },
  });

  return res.send(users);
};

exports.declineFriendRequestPost = async (req, res) => {
  const id = Number(req.body.id);
  await prisma.friends.deleteMany({
    where: {
      userId: id,
      friendId: req.user.user.id,
    },
  });

  const friendInvites = await prisma.friends.findMany({
    where: {
      friendId: req.user.user.id,
      status: "pending",
    },
  });

  const notifications = friendInvites.map((friend) => friend.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...notifications],
      },
    },
  });

  return res.send(users);
};

exports.acceptFriendRequest = async (req, res) => {
  const io = getIO();
  const id = Number(req.body.id);

  const chat = await prisma.chat.create();

  const friendsGroupId = await prisma.friends.updateManyAndReturn({
    where: {
      userId: id,
      friendId: req.user.user.id,
    },
    data: {
      status: "friends",
    },
  });

  await prisma.usersInChat.create({
    data: {
      chatId: chat.id,
      friendsId: friendsGroupId[0].id,
    },
  });

  const friendInvites = await prisma.friends.findMany({
    where: {
      friendId: req.user.user.id,
      status: "pending",
    },
  });

  const notifications = friendInvites.map((friend) => friend.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...notifications],
      },
    },
  });

  const friendsId = await prisma.friends.findMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          status: "friends",
        },
        {
          friendId: req.user.user.id,
          status: "friends",
        },
      ],
    },
  });

  const friends = friendsId.map((user) => user.friendId);
  const friends2 = friendsId.map((user) => user.userId);

  const users2 = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            in: [...friends, ...friends2],
          },
        },
        {
          id: { not: req.user.user.id },
        },
      ],
    },
  });

  io.emit("getStatusOfAllUsersInChat");

  res.send({ users: users, users2: users2 });
};

exports.openChat = async (req, res) => {
  const friendsId = await prisma.friends.findMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          status: "friends",
        },
        {
          friendId: req.user.user.id,
          status: "friends",
        },
      ],
    },
  });

  const friends = friendsId.map((user) => user.friendId);
  const friends2 = friendsId.map((user) => user.userId);

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            in: [...friends, ...friends2],
          },
        },
        {
          id: { not: req.user.user.id },
        },
      ],
    },
  });

  return res.send(users);
};

exports.removeFriend = async (req, res) => {
  const io = getIO();

  const friendId = await prisma.friends.findFirst({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          friendId: Number(req.body.friendId),
          status: "friends",
        },
        {
          friendId: req.user.user.id,
          userId: Number(req.body.friendId),
          status: "friends",
        },
      ],
    },
  });

  const chat = await prisma.usersInChat.findFirst({
    where: {
      friendsId: friendId.id,
    },
  });

  await Promise.all([
    prisma.message.deleteMany({
      where: {
        chatId: chat.chatId,
      },
    }),

    prisma.usersInChat.deleteMany({
      where: {
        chatId: chat.chatId,
        friendsId: friendId.id,
      },
    }),
  ]);


  await prisma.chat.deleteMany({
    where: {
      id: chat.chatId,
    },
  });

  await prisma.friends.deleteMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          friendId: Number(req.body.friendId),
        },
        {
          userId: Number(req.body.friendId),
          friendId: req.user.user.id,
        },
      ],
    },
  });

  const friendsId = await prisma.friends.findMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          status: "friends",
        },
        {
          friendId: req.user.user.id,
          status: "friends",
        },
      ],
    },
  });

  const friends = friendsId.map((user) => user.friendId);
  const friends2 = friendsId.map((user) => user.userId);

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            in: [...friends, ...friends2],
          },
        },
        {
          id: { not: req.user.user.id },
        },
      ],
    },
  });

  const [friend, currentUser] = await Promise.all([
    prisma.user.findUnique({
      where: { id: Number(req.body.friendId) },
    }),

    prisma.user.findUnique({
      where: { id: req.user.user.id },
    }),
  ]);

  const sockets = await io.in(`user:${friend.username}`).fetchSockets();
  io.to(`user:${req.user.user.username}`).emit("removeUserForSameAccount")

  sockets.forEach((socket) => {
    socket.emit("removeUser", {
      username: currentUser.username,
    });
  });

  return res.send(users);
};
