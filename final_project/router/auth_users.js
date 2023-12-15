const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username: user.username }, "your_jwt_secret", { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports.authenticated = regd_users;
module.exports.users = users;


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; // Assuming the review is sent in the request body

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    // Verify the user from the JWT token
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    let username;
    try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        username = decoded.username;
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }

    // Find the book by ISBN and add or update the review
    const book = books.find(b => b.ISBN === isbn);
    if (book) {
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
