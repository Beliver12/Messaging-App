const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const router = Router();

const verify = require("../controllers/verifyToken");
const friendsController = require("../controllers/friendsController");

router.post("/addFriend", verify.verifyToken, friendsController.addFriendsPost);
router.post(
  "/notifications",
  verify.verifyToken,
  friendsController.notificationPost,
);
router.post(
  "/declineFriendRequest",
  verify.verifyToken,
  friendsController.declineFriendRequestPost,
);
router.post(
  "/acceptFriendRequest",
  verify.verifyToken,
  friendsController.acceptFriendRequest,
);
router.post("/openChat", verify.verifyToken, friendsController.openChat);
router.post(
  "/removeFriend",
  verify.verifyToken,
  friendsController.removeFriend,
);
module.exports = router;
