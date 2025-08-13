import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

import handleRegister from "./controllers/register.js";
import signin from "./controllers/signin.js";
import getProfile from "./controllers/profile.js";
import faceDetect from "./controllers/facedetect.js";
import imageCount from "./controllers/imagecount.js";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "mattboehm",
    database: "smart-brain",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Signin
app.post("/signin", (req, res) => {
  signin(req, res, db, bcrypt);
});

//Register new user
app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

//Get user by id
app.get("/profile/:id", (req, res) => {
  getProfile(req, res, db);
});

//Run the faceDetect function
app.post("/image", (req, res) => {
  faceDetect(req, res);
});

//Increase user entry count
app.put("/imagecount", (req, res) => {
  imageCount(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port", ${process.env.PORT}`);
});
