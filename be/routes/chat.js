const { Router } = require("express");
const router = Router();

const verify = require("../controllers/verifyToken");
const chatController = require("../controllers/chatController");

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", verify.verifyToken, chatController.startChat);
router.post(
  "/sendMessage",
  upload.single("myfile"),
  verify.verifyToken,
  chatController.sendMessage,
);
router.post("/getRealTimeMessages", chatController.getRealTimeMessages)

module.exports = router;
