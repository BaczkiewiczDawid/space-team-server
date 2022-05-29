const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.connect();

app.get("/api/posts", (req, res) => {
  const getPosts = "SELECT * FROM space_posts";

  db.query(getPosts, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/new-post", (req, res) => {
  const newPost = req.body.newPost;

  const addNewPost = `INSERT INTO space_posts VALUES(null, '${newPost.author}', '${newPost.description}', 'https://images.unsplash.com/photo-1653624824808-e1597cf459a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1033&q=80')`;

  db.query(addNewPost, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(5000, () => {
  console.log("running");
});
