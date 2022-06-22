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
  const getPosts =
    "SELECT username, description, img, space_users.id, picture, space_posts.id as postID FROM space_users, space_posts WHERE space_users.id = space_posts.author ORDER BY space_posts.id DESC";

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

  const addUser = `INSERT INTO space_users VALUES (null, '${userData.username}', '${hashedPassword}', '${userData.email}', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80', null, null, null, null)`;

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
      } else {
        res.send(result);
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

  const getUser = `SELECT id, username, email, picture, job, phone, country, city FROM space_users WHERE id = ${userData}`;

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

  const getUserPosts = `SELECT space_posts.id, space_users.id, picture, username, description, img FROM space_posts, space_users WHERE space_posts.author = space_users.id AND author = '${userData}' ORDER BY  space_posts.id DESC`;

  db.query(getUserPosts, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/set-data", (req, res) => {
  const userData = req.body.userData;

  const updateUserData = `UPDATE space_users SET job = '${userData.job}', phone = '${userData.phone}', country = '${userData.country}', city='${userData.city}' WHERE id = '${userData.id}'`;

  db.query(updateUserData, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/friends-list", (req, res) => {
  const userData = req.body.userData;

  const getFriendsList = `SELECT DISTINCT space_users.id, space_users.picture, space_users.username, space_users.id  FROM space_friends_list, space_users WHERE space_users.id = space_friends_list.friendid AND space_friends_list.userid = ${userData}`;

  db.query(getFriendsList, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/delete-friend", (req, res) => {
  const userData = req.body.userData;

  const removeFriend = `DELETE FROM space_friends_list WHERE friendid = ${userData}`;

  db.query(removeFriend, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/add-friend", (req, res) => {
  const userData = req.body.userData;

  const addFriend = `INSERT INTO space_friends_list VALUES (${userData.userID}, '${userData.username}', ${userData.friendID}, null)`;

  db.query(addFriend, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post("/api/new-message", (req, res) => {
  const userData = req.body.userData;

  const newMessage = `INSERT INTO space_messages VALUES(null, '${userData.inputValue}', ${userData.userID})`;

  db.query(newMessage, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/api/load-messages", (req, res) => {
  const loadMessages = `SELECT space_messages.id, message, picture, username, space_users.id as userid FROM space_messages, space_users WHERE space_messages.author = space_users.id ORDER BY id ASC`;

  db.query(loadMessages, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/change-picture", (req, res) => {
  const userData = req.body.userData;

  const changePicture = `UPDATE space_users SET picture = '${userData.picture}' WHERE id = ${userData.user}`;

  db.query(changePicture, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/add-like", (req, res) => {
  const userData = req.body.userData;

  const like = `INSERT INTO space_posts_likes VALUES(null, ${userData.postID}, ${userData.userID})`;

  db.query(like, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
    console.log(like);
  });
});

app.post("/api/delete-like", (req, res) => {
  const userData = req.body.userData;

  const like = `DELETE FROM space_posts_likes WHERE postID = ${userData.postID} AND userID = ${userData.userID}`;

  db.query(like, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
    console.log(like);
  });
});

app.post("/api/likes-list", (req, res) => {
  const userData = req.body.userData;

  const isLiked = `SELECT * FROM space_posts_likes WHERE userID = ${userData.userID} AND postID = ${userData.postID}`;

  db.query(isLiked, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/count-likes", (req, res) => {
  const userData = req.body.userData;

  const countLikes = `SELECT COUNT(postID) as count FROM space_posts_likes WHERE postID = ${userData.postID}`;

  db.query(countLikes, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port)
