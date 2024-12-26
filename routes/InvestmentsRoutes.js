import express from "express";
import { MongoClient, ObjectId } from "mongodb";
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

// TODO: test this
investmentsRouter.post("/addStatement", async (req, res) => {
  const {
    investmentId,
    startBalanceDate,
    startBalance,
    endBalanceDate,
    endBalance,
    depositAmount,
    withdrawalAmount,
    startMonth,
    endMonth,
  } = req.body;

  const newStatementData = {
    statementId: new ObjectId(),
    startBalanceDate: toDateOnly(startBalanceDate),
    startBalance: toDollarAmount(startBalance.toString()),
    endBalanceDate: toDateOnly(endBalanceDate),
    endBalance: toDollarAmount(endBalance.toString()),
    depositAmount: toDollarAmount(depositAmount.toString()),
    withdrawalAmount: toDollarAmount(withdrawalAmount.toString()),
    startMonth: startMonth,
    endMonth: endMonth,
  };

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestmentReports = db.collection("InvestmentReports");

    const investmentReportToAddStatement = await allInvestmentReports.findOne({
      investmentReportId: investmentId,
    });

    const newlyAddedStatement =
      await investmentReportToAddStatement.statements.insertOne(
        newStatementData
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
    startMonth,
    endMonth,
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
          "statements.$.startMonth": startMonth,
          "statements.$.endMonth": endMonth,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      res
        .status(404)
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

// TODO: Test this
investmentsRouter.delete("/statement", async (req, res) => {
  const investmentReportId = req.query.investmentReportId;
  const statementId = req.query.statementId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investmentReports = db.collection("InvestmentReports");

    const result = await investmentReports.updateOne(
      { _id: new ObjectId(investmentReportId) },
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

// TODO: Test this
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
      res.status(404).json({
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
