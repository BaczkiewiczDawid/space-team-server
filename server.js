const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/posts", (req, res) => {
  const getPosts = "SELECT username, description, img, space_users.id, picture FROM space_users, space_posts WHERE space_users.id = space_posts.author";

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

  const addNewPost = `INSERT INTO space_posts VALUES(null, ${newPost.author}, '${newPost.description}', '${newPost.img}')`;

  db.query(addNewPost, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/register", (req, res) => {
  const userData = req.body.userData;
  const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);

  const addUser = `INSERT INTO space_users VALUES (null, '${userData.username}', '${hashedPassword}', '${userData.email}')`;

  db.query(addUser, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/login", (req, res) => {
  const userData = req.body.userData;

  const getUser = `SELECT * FROM space_users WHERE email = '${userData.email}'`;

  db.query(getUser, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        const isPasswordMatch = bcrypt.compareSync(
          userData.password,
          result[0].password
        );
        result.push(isPasswordMatch);

        if (isPasswordMatch) {
          res.send(result);
        }
      }
    }
  });
});

app.post("/api/search", (req, res) => {
  const userData = req.body.userData;

  const getUsersList = `SELECT * FROM space_users WHERE username LIKE '%${userData}%'`;

  if (getUsersList !== `SELECT * FROM space_users WHERE username LIKE '%%'`) {
    db.query(getUsersList, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }
});

app.post("/api/get-user", (req, res) => {
  const userData = req.body.userData;

  const getUser = `SELECT id, username, email, picture FROM space_users WHERE id = ${userData}`;

  db.query(getUser, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/user-posts", (req, res) => {
  const userData = req.body.userData;

  const getUserPosts = `SELECT * FROM space_posts WHERE author = '${userData}'`;

  db.query(getUserPosts, (err, result) => {
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
