import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { getMonthIndex } from "./Utils/Dates.js";
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

    // TODO: parsing seems unnecessary (maybe store them as strings in the first place?)
    if (userInvestmentReports) {
      userInvestmentReports.forEach((investment) => {
        investment.statements.forEach((statement) => {
          statement.depositAmount = parseFloat(
            statement.depositAmount.toString()
          );
          statement.startBalanceDate = statement.startBalanceDate.toString();
          statement.endBalanceDate = statement.endBalanceDate.toString();
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

// TODO: it feels weird that this fetch happens right after investmentReports are fetched, both of which at least begins with fetching investmentReport (i.e. seems like redundant work is happening)
investmentsRouter.get("/investmentChartData", async (req, res) => {
  const userId = req.query.userId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const latestEndBalanceDate = await allInvestmentReports
      .aggregate([
        { $match: { userId: userId } },
        { $unwind: "$statements" },
        {
          $group: {
            _id: null, // Group all documents into a single group
            latestEndBalanceDate: { $max: "$statements.endBalanceDate" },
          },
        },
      ])
      // TODO: change this (we don't want an array; see code below)
      .toArray();

    const latestMonthIndex = getMonthIndex(
      latestEndBalanceDate[0].latestEndBalanceDate
    );

    let newChartData = [
      { month: months[latestMonthIndex - 2] },
      { month: months[latestMonthIndex - 1] },
      { month: months[latestMonthIndex] },
    ];

    // TODO: For each UserInvestmentReport, filter out statement objects where endBalanceDates are less than latestMonthIndex - 2
    const userInvestmentReports = await allInvestmentReports
      .find({
        userId: userId,
      })
      .toArray();

    userInvestmentReports.forEach((investment) => {
      investment.statements.forEach((statement) => {
        newChartData.forEach((chartData) => {
          if (
            chartData.month ===
            months[getMonthIndex(statement.startBalanceDate)]
          ) {
            chartData[investment.brokerageName] = parseFloat(
              statement.startBalance.toString()
            );
          } else if (
            chartData.month === months[getMonthIndex(statement.endBalanceDate)]
          ) {
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
    startBalanceDate,
    startBalance,
    endBalanceDate,
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
        statementId: new ObjectId(),
        startBalanceDate: toDateOnly(startBalanceDate),
        startBalance: toDollarAmount(startBalance.toString()),
        endBalanceDate: toDateOnly(endBalanceDate),
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

investmentsRouter.post("/addStatement", async (req, res) => {
  const {
    investmentId,
    startBalanceDate,
    startBalance,
    endBalanceDate,
    endBalance,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  const newStatementData = {
    statementId: new ObjectId(),
    startBalanceDate: toDateOnly(startBalanceDate),
    startBalance: toDollarAmount(startBalance.toString()),
    endBalanceDate: toDateOnly(endBalanceDate),
    endBalance: toDollarAmount(endBalance.toString()),
    depositAmount: toDollarAmount(depositAmount.toString()),
    withdrawalAmount: toDollarAmount(withdrawalAmount.toString()),
  };

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const investmentReportObjectId = new ObjectId(investmentId);

    const newlyAddedStatement = await allInvestmentReports.updateOne(
      { _id: investmentReportObjectId },
      { $push: { statements: newStatementData } }
    );

    if (newlyAddedStatement) {
      res.send(newlyAddedStatement);
    } else {
      res
        .status(400)
        .json({ message: "Error adding statement to investment report" });
    }
  } finally {
    await client.close();
  }
});

investmentsRouter.put("/statement", async (req, res) => {
  const {
    investmentId,
    statementId,
    startBalance,
    startBalanceDate,
    endBalance,
    endBalanceDate,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const updateResult = await allInvestmentReports.updateOne(
      {
        _id: new ObjectId(investmentId),
        "statements.statementId": new ObjectId(statementId),
      },
      {
        $set: {
          "statements.$.startBalanceDate": toDateOnly(startBalanceDate),
          "statements.$.startBalance": toDollarAmount(startBalance),
          "statements.$.endBalanceDate": toDateOnly(endBalanceDate),
          "statements.$.endBalance": toDollarAmount(endBalance),
          "statements.$.depositAmount": toDollarAmount(depositAmount),
          "statements.$.withdrawalAmount": toDollarAmount(withdrawalAmount),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      res
        .status(400)
        .send("No statement found with the given investment or statement ID.");
    } else {
      res.status(200).send("Statement updated successfully.");
    }
  } catch (error) {
    console.error("Failed to update statement:", error);
    res.status(500).send("Error updating statement.");
  } finally {
    await client.close();
  }
});

investmentsRouter.delete("/statement", async (req, res) => {
  const { investmentId, statementId } = req.query;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investmentReports = db.collection("InvestmentReports");

    const result = await investmentReports.updateOne(
      { _id: new ObjectId(investmentId) },
      { $pull: { statements: { statementId: new ObjectId(statementId) } } } // Pull (remove) the statement from the array
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({
        message:
          "No investment report found with the given investment Id, or no statement found with the given statement Id",
      });
    } else {
      res.json({ message: "Statement deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting statement:", error);
    res.status(500).json({ message: "Failed to delete the statement" });
  } finally {
    await client.close();
  }
});

investmentsRouter.delete("/investmentReport", async (req, res) => {
  const investmentReportId = req.query.investmentReportId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investmentReports = db.collection("InvestmentReports");

    const result = await investmentReports.deleteOne({
      _id: new ObjectId(investmentReportId),
    });

    if (result.deletedCount === 0) {
      res.status(400).json({
        message:
          "No investment report found with the given investment report Id",
      });
    } else {
      res.json({ message: "Investment report deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting investment report:", error);
    res.status(500).json({ message: "Failed to delete the investment report" });
  } finally {
    await client.close();
  }
});

export default investmentsRouter;
