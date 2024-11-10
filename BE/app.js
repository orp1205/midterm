// app.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require("path"); // Import path module
const User = require("./models/User"); // Ensure you have the User model imported
const app = express();
const upload = multer();

app.use(express.urlencoded({ extended: true }));  // For URL-encoded form data
// app.use(express.json());  // For JSON data (if your form sends JSON)
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

app.post("/api/register", upload.none(), async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    
    const user = new User({ username, password: hashedPassword }); // Create a new user
    await user.save(); // Save the user to the database
    res.redirect("http://localhost:8080/login.html");  // Send success response
  });
  // Login route
  app.post("/api/login", upload.none(), async (req, res) => {
    const body = req.body;
    console.log(body);
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid username or password");
    }
    res.redirect("http://localhost:8080/index.html"); 
  });

// Khởi động server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});