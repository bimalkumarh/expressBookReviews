const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMzcxODc2MywiaWF0IjoxNzIzNzE4NzYzfQ.NWTP8osd1YlJ71K2GRDuQdVryDcjgI7PmUoumHXNcC4";

const isValid = (username) => {
  let validUser = users.filter((user) => user.username === username);
  if (validUser.length > 0) {
    return false;
  }
  return true;
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  let authUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (authUser.length > 0) {
    return true;
  }
  return false;
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign(
      { username: username },
      SECRET_KEY,
      (expiresIn = "24h")
    );
    req.session.token = token;
    return res.json({ message: "Login successful", token: token });
  }
  //Write your code here
  return res.json({ message: "Invalid credentials" }).status(401);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  if (!review)
    return res.json({ message: "Please provide a review" }).status(400);

  const user = req.user;
  if (books[isbn]) {
    books[isbn].reviews[user.username] = review;
    return res.json({ message: "Review added successfully" });
  } else return res.json({ message: "Book not found" }).status(404);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const user = req.user;
  if (books[isbn]) {
    delete books[isbn].reviews[user.username];
    return res.json({ message: "Review deleted successfully" });
  } else return res.json({ message: "Book not found" }).status(404);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
