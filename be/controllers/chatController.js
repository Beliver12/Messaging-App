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

exports.startChat = async (req, res) => {
    const io = getIO();
    const id = Number(req.body.friendId);

    const friendsId = await prisma.friends.findFirst({
        where: {
          OR: [
            {
              userId: req.user.user.id,
              friendId: id,
              status: "friends",
            },
            {
              friendId: req.user.user.id,
              userId: id,
              status: "friends",
            },
          ],
        },
      });

    const userInChat = await prisma.user.findFirst({
        where: {
            id: id
        }
    })

    const chat = await prisma.usersInChat.findFirst({
        where: {
            friendsId: friendsId.id
          }
    })

    const messages = await prisma.message.findMany({
      where: {
        chatId: chat.chatId
      }
    })

   res.send({chat: chat, userInChat: userInChat, messages: messages})
}

exports.sendMessage = async (req, res) => {
const date = new Date().toLocaleString()
if(!req.file && !req.body.message) {
  return res.status(400).send({
    error: "cant send empty message",
  });
}
  if(req.file) {
await prisma.message.create({
      data:{
        chatId: Number(req.body.chatId),
        userId: req.user.user.id,
        message: req.body.message,
        image: req.file.filename,
        username: req.user.user.username,
        date: date
      }
    })
  } else {
    await prisma.message.create({
      data:{
        chatId: Number(req.body.chatId),
        userId: req.user.user.id,
        message: req.body.message,
        username: req.user.user.username,
        date: date
      }
    })
  
  }
  const messages = await prisma.message.findMany({
    where: {
      chatId: Number(req.body.chatId)
    }
  })
  return res.send(messages);
  
}