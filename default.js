const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://Lexus:Isabirye011%401@alexcluster.iudqq4y.mongodb.net/?retryWrites=true&w=majority&appName=Alexcluster";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usersCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("testdb"); // use your actual DB name here
        usersCollection = db.collection("users");
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ DB connection error:", err);
    }
}

connectDB();

// ✅ Root route
app.get('/', (req, res) => {
    res.send('✅ API is running. Use /users to interact with the database.');
});

// POST route: add a user
app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET route: list all users
app.get('/users', async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
