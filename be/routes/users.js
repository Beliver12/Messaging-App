const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const router = Router();

const userController = require("../controllers/userController");
const verify = require("../controllers/verifyToken");
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

router.post("/signup", upload.single("myfile"), userController.signupUserPost);
router.post("/login", userController.loginUserPost);
router.post("/", verify.verifyToken, userController.usersPost);
router.post("/verifyToken", verify.verifyToken, userController.verifyUserToken);
router.post(
  "/checkUserProfile",
  verify.verifyToken,
  userController.checkUserProfilePost,
);
router.post("/logOut", verify.verifyToken, userController.logOut);
router.post(
  "/edit",
  upload.single("myfile"),
  verify.verifyToken,
  userController.editUserProfile,
);
module.exports = router;
