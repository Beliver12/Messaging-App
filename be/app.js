const cors = require("cors");
require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const path = require("node:path");
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const routes = require('./routes');

const app = express();

// Serve images at http://localhost:8080/images/<filename>
app.use('/images', express.static(path.join(__dirname, 'images')));




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
}));

app.use('/session', routes.session);
app.use('/users', routes.users)

app.listen(process.env.PORT, () => {
  console.log(`My first Express app - listening on port ${process.env.PORT}!`);
});
