const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// const db = mysql.createConnection({
//     host: 'remotemysql.com',
//     user: 'lePa70XFJ1',
//     password: 'uMYo4LVHdm',
//     database: 'lePa70XFJ1'
// })

app.use(cors());
app.use(express.json());

db.connect();

app.get('/api/posts', (req, res) => {
    const getPosts = 'SELECT * FROM space_posts';

    db.query(getPosts, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.listen(5000, () => {
    console.log('running');
})