const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.json({ message: "Please provide username and password" }).status(400);
  }

  if (isValid(username)) {
    users.push({ username, password });
    return res.json({ message: "User registered successfully" });
  }

  //Write your code here
  return res.json({ message: "User already exists" }).status(400);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) {
    return res.json(books, null, 2).status(200);
  }
  //Write your code here
  return res.json({ message: "No books available" }).status(404);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn.trim();
  if (books[isbn]) {
    res.json(books[isbn], null, 2).status(200);
  }
  //Write your code here
  return res.json({ message: "Book not found" }).status(404);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.trim();

  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    return res.json(booksByAuthor, null, 2).status(200);
  }
  //Write your code here
  return res.json({ message: "No books found for this author" }).status(404);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.trim();

  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length > 0) {
    return res.json(booksByTitle, null, 2).status(200);
  }
  //Write your code here
  return res.json({ message: "No books found with this title" }).status(404);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn.trim();
  if (books[isbn].reviews) {
    return res.json(books[isbn].reviews, null, 2).status(200);
  }

  //Write your code here
  return res.json({ message: "No books found with this ISBN" }).status(404);
});

module.exports.general = public_users;
