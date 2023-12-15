const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve) => {
      resolve(books);
    })
    .then(books => res.send(JSON.stringify({books}, null, 4)))
    .catch(err => res.status(500).send(err.message));
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      let filtered_ISBN = Object.values(books).filter(book => book.isbn === isbn);
      if (filtered_ISBN.length > 0) {
        resolve(filtered_ISBN);
      } else {
        reject(new Error('Book not found'));
      }
    })
    .then(book => res.send(book))
    .catch(err => res.status(404).send(err.message));
  });
  

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
      const author = req.params.author;
      let filtered_author = Object.values(books).filter(book => book.author === author);
      if (filtered_author.length > 0) {
        resolve(filtered_author);
      } else {
        reject(new Error('No books found for this author'));
      }
    })
    .then(books => res.send(books))
    .catch(err => res.status(404).send(err.message));
  });
  


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    let filtered_title = Object.values(books).filter(book => book.title === title);
    if (filtered_title.length > 0) {
      resolve(filtered_title);
    } else {
      reject(new Error('Book not found'));
    }
  })
  .then(books => res.send(books))
  .catch(err => res.status(404).send(err.message));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; 
    let filtered_book = Object.values(books).filter(book => book.isbn === isbn);

    if (filtered_book.length > 0) {
        res.send(filtered_book[0].reviews);
    } else {
        res.status(404).send('Book not found');
    }
});


module.exports.general = public_users;
