import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// TODO: abstract this setup stuff
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

investmentsRouter.get("/investmentReports", async (req, res) => {
  const userId = req.query.userId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const userInvestmentReports = await allInvestmentReports
      .find({ userId: userId })
      .toArray();

    if (userInvestmentReports) {
      res.send(userInvestmentReports);
    } else {
      res
        .status(400)
        .json({ message: "Could not find investment reports or is empty" });
    }
  } finally {
    await client.close();
  }
});

investmentsRouter.post("/addInvestment", async (req, res) => {
  const {
    brokerageName,
    investmentType,
    investmentSubtype,
    userId,
    startDate,
    startBalance,
    endDate,
    endBalance,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  const newInvestmentReportData = {
    brokerageName,
    investmentType,
    investmentSubtype,
    userId,
    statements: [
      {
        startDate,
        startBalance,
        endDate,
        endBalance,
        depositAmount,
        withdrawalAmount,
      },
    ],
  };

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investmentReports = db.collection("InvestmentReports");

    const newlyCreatedInvestment = await investmentReports.insertOne(
      newInvestmentReportData
    );

    if (newlyCreatedInvestment) {
      res.send(newlyCreatedInvestment);
    } else {
      res.status(400).json({ message: "Error creating new investment report" });
    }
  } finally {
    await client.close();
  }
});

export default investmentsRouter;
