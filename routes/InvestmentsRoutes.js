import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { months } from "./Utils/Months.js";
import { toDateOnly, toDollarAmount } from "./Utils/Formatters.js";

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
      userInvestmentReports.forEach((investment) => {
        investment.statements.forEach((statement) => {
          statement.depositAmount = parseFloat(
            statement.depositAmount.toString()
          );
          statement.startBalanceDate = statement.startDate.toString();
          statement.endBalanceDate = statement.endDate.toString();
          statement.endBalance = parseFloat(statement.endBalance.toString());
          statement.startBalance = parseFloat(
            statement.startBalance.toString()
          );
          statement.withdrawalAmount = parseFloat(
            statement.withdrawalAmount.toString()
          );
        });
      });

      res.send(userInvestmentReports);
    } else {
      res
        .status(400)
        .json({ message: "Could not find investment reports or is empty" });
    }
  } finally {
    // TODO: consolidate this and investmentChartData get requests
    // await client.close();
  }
});

investmentsRouter.get("/investmentChartData", async (req, res) => {
  const userId = req.query.userId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const userInvestmentReports = await allInvestmentReports
      .find({ userId: userId })
      .toArray();

    const date = new Date();

    let newChartData = [
      { month: months[date.getMonth() - 4] },
      { month: months[date.getMonth() - 3] },
      { month: months[date.getMonth() - 2] },
    ];

    userInvestmentReports.forEach((investment) => {
      investment.statements.forEach((statement) => {
        newChartData.forEach((chartData) => {
          if (chartData.month === statement.startMonth) {
            chartData[investment.brokerageName] = parseFloat(
              statement.startBalance.toString()
            );
          } else if (chartData.month === statement.endMonth) {
            chartData[investment.brokerageName] = parseFloat(
              statement.endBalance.toString()
            );
          }
        });
      });
    });

    if (userInvestmentReports) {
      res.send(newChartData);
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
        startDate: toDateOnly(startDate),
        startBalance: toDollarAmount(startBalance.toString()),
        endDate: toDateOnly(endDate),
        endBalance: toDollarAmount(endBalance.toString()),
        depositAmount: toDollarAmount(depositAmount.toString()),
        withdrawalAmount: toDollarAmount(withdrawalAmount.toString()),
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
