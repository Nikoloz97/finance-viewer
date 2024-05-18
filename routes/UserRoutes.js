import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Ability to utilize env variables
dotenv.config();

const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const users = db.collection("Users");

    const user = await users.findOne({ username, password });

    if (user) {
      res.send(user);
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } finally {
    await client.close();
  }
});

export default router;
