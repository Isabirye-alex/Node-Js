const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
const port = 3000;

const uri =
  "mongodb+srv://Lexus:Isabirye011%401@alexcluster.iudqq4y.mongodb.net/Easy_Mall?retryWrites=true&w=majority&appName=Alexcluster";
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", (open) => console.log("Db opened successfully"));

app.get("/", (req, res) => {
  res.json("App is working Wonderfully");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

const { Schema, model } = mongoose;
const userShcema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please name is required"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const user = model('user', userShcema);

//Part to handle user insertion into the database
app.post('/users', async (req, res) => {
  try {
    const newUser = await user.create(req.body);
    res.status(201).json(newUser); // Respond with created user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const allUsers = await user.find(req.body);
    res.status(201).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
})

