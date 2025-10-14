const cors = require("cors");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { initSocket } = require("./socket");
const path = require("node:path");

const routes = require("./routes");

const app = express();

//un comment belov code when deploying

const allowedOrigins = [
  'https://messaging-app-seven-chi.vercel.app',
  'https://messaging-a4p2xtdw4-beliver12s-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(
  cors({
    origin: 'https://messaging-app-seven-chi.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type'],
  })
);

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

//un comment above code when deploying

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  }),
);*/

app.use("/session", routes.session);
app.use("/users", routes.users);
app.use("/friends", routes.friends);
app.use("/chat", routes.chat);

const expressServer = app.listen(process.env.PORT, () => {
  console.log(`My first Express app - listening on port ${process.env.PORT}!`);
});

initSocket(expressServer); // init socket.io once
