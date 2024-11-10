// app.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path"); // Import path module
const User = require("./models/User"); // Ensure you have the User model imported
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../GameService'))); // Serve static HTML files

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/mydatabase", {
  useUnifiedTopology: true, // Ensure this is included for the new connection management engine
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Serve the index page from Nginx
app.get("/", (req, res) => {
  res.write("Hello world");
});

// Other routes remain unchanged
app.post("/items", async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).send(item);
});

// Serve the registration page
app.get("/register", (req, res) => {
  res.redirect("/register.html"); 
});

// Serve the login page
app.get("/login", (req, res) => {
  res.redirect("/login.html");
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send("Invalid username or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid username or password");
  }
  res.redirect("/index.html"); 
});

// Khởi động server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});