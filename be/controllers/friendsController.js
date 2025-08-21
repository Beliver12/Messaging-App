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

exports.addFriendsPost = async (req, res) => {
  const id = Number(req.body.friendId);

  await prisma.friends.create({
    data: {
      friendId: id,
      status: "pending",
      userId: req.user.user.id,
    },
  });

  const addedUsers = await prisma.friends.findMany({
    where: {
      userId: req.user.user.id,
    },
  });

  const addedFriends = addedUsers.map((user) => user.friendId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: [req.user.user.id, ...addedFriends],
      },
    },
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
  const id = Number(req.body.id)
  await prisma.friends.deleteMany({
    where: {
      userId: id,
      friendId: req.user.user.id,
    }
  })

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
  const id = Number(req.body.id)
  await prisma.friends.updateMany({
    where: {
      userId: id,
      friendId: req.user.user.id,
    },
    data: {
      status: 'friends'
    }
  })

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

exports.openChat = async (req, res) => {
  const friendsId = await prisma.friends.findMany({
    where: {
      OR: [
        {
          userId: req.user.user.id,
          status: 'friends'
        },
        {
          friendId: req.user.user.id,
          status: 'friends'
        },
        
      ]
    },
  })

  const friends = friendsId.map((user) => user.friendId)
  const friends2 = friendsId.map((user) => user.userId)

  const users = await prisma.user.findMany({
    where: {
      AND: [ {
        id: {
          in: [...friends, ...friends2]
        }
      },
      {
        id: {not : req.user.user.id}
      }
      ]
    },
  
})

return res.send(users);
}