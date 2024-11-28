import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { BlobServiceClient } from "@azure/storage-blob";

// Ability to utilize env variables
dotenv.config();

const router = express.Router();
const uri = process.env.MONGODB_URI;
const blobConnectionString = process.env.AZURE_BLOB_CS;
// Level of encryption
const saltRounds = 10;

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
      // TODO: is there a way the server can return the specifics itself?
      res.status(400).json({ message: "Invalid username or password" });
    }
  } finally {
    await client.close();
  }
});

router.post("/signup", async (req, res) => {
  const signupInfo = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const users = db.collection("Users");

    // Middleware 1: password-hashing
    // TODO: Uncomment
    // const hashedPassword = await bcrypt.hash(signupInfo.password, saltRounds)
    // signupInfo.password = hashedPassword;

    // Middleware 2: profile image storage (blob)
    // TODO: Uncomment
    // const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString)
    // const containerClient = blobServiceClient.getContainerClient("profile-images")
    // const blockBlobClient = containerClient.getBlockBlobClient("financeviewer")

    // // TODO: implement a try-catch here
    // const uploadBlobResponse = await blockBlobClient.uploadFile(signupInfo.profileImgUrl)

    // spread operator = makes properties top-level
    const user = await users.insertOne(signupInfo);

    if (user) {
      res.send(user);
    } else {
      res.status(400).json({ message: "Error saving your account" });
    }
  } finally {
    await client.close();
  }
});

export default router;
