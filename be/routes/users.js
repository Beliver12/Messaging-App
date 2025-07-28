const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = Router();


const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const multer = require('multer')

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images')); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage })

router.post("/signup",  upload.single('myfile'),  userController.signupUserPost, );
router.post("/login", userController.loginUserPost);

module.exports = router;
