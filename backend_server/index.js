const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv'); 
const app = express();
const port = 3000;
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URL;
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Db opened successfully"));

// Routes
const categoryRoutes = require('./routes/category.routes');
app.use('/categories', categoryRoutes);

// Test root
app.get("/", (req, res) => {
  res.json("App is working Wonderfully");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
