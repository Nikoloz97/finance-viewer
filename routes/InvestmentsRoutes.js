import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// TODO: abstract this setup stuff somehow
// Ability to utilize env variables
dotenv.config();

const investmentsRouter = express.Router();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});

investmentsRouter.post("/add", async (req, res) => {
  const newInvestmentData = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investments = db.collection("InvestmentReports");

    const user = await investments.insertOne(newInvestmentData);

    if (user) {
      res.send(user);
    } else {
      res.status(400).json({ message: "Error saving new investment report" });
    }
  } finally {
    await client.close();
  }
});

export default investmentsRouter;
