import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { getCutOffDate, getMonthIndex } from "./Utils/Dates.js";
import { months } from "./Utils/Months.js";
import { toDollarAmount } from "./Utils/Formatters.js";

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

investmentsRouter.get("/investments", async (req, res) => {
  const userId = req.query.userId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestments = db.collection("Investments");

    const userInvestments = await allInvestments
      .find({ userId: userId })
      .toArray();

    // TODO: parsing seems unnecessary (maybe store them as strings in the first place?)
    if (userInvestments) {
      userInvestments.forEach((investment) => {
        investment.statements.forEach((statement) => {
          statement.depositAmount = parseFloat(
            statement.depositAmount.toString()
          );
          statement.startDate = statement.startDate.toString();
          statement.endDate = statement.endDate.toString();
          statement.endBalance = parseFloat(statement.endBalance.toString());
          statement.startBalance = parseFloat(
            statement.startBalance.toString()
          );
          statement.withdrawalAmount = parseFloat(
            statement.withdrawalAmount.toString()
          );
        });
      });

      res.send(userInvestments);
    } else {
      res
        .status(400)
        .json({ message: "Could not find investment or is empty" });
    }
  } finally {
    // TODO: consolidate this and investmentChartData get requests
    // await client.close();
  }
});

// TODO: it feels weird that this fetch happens right after investments are fetched, both of which at least begins with fetching investment (i.e. seems like redundant work is happening)
investmentsRouter.get("/investmentChartData", async (req, res) => {
  const userId = req.query.userId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestments = db.collection("Investments");

    const latestEndDateObject = await allInvestments
      .aggregate([
        { $match: { userId: userId } },
        { $unwind: "$statements" }, // creates investment out of each statement item
        {
          $group: {
            _id: null, // Group all documents into a single group
            latestEndDate: { $max: "$statements.endDate" },
          },
        },
      ])
      .next(); // grabs the first item

    const latestMonthIndex = getMonthIndex(latestEndDateObject.latestEndDate);

    let newChartData =
      latestMonthIndex >= 2
        ? [
            { month: months[latestMonthIndex - 2] },
            { month: months[latestMonthIndex - 1] },
            { month: months[latestMonthIndex] },
          ]
        : latestMonthIndex === 1
        ? [{ month: months[11] }, { month: months[0] }, { month: months[1] }]
        : [{ month: months[10] }, { month: months[11] }, { month: months[0] }];

    const cutoffDate = getCutOffDate(latestEndDateObject.latestEndDate, -2);

    const eligibleStatements = await allInvestments
      .aggregate([
        { $match: { userId: userId } },
        { $unwind: "$statements" }, // flatten statements
        {
          $match: {
            "statements.endDate": {
              $gte: cutoffDate,
            },
          },
        }, // filter out anything less than cutoff date
        {
          // TODO: break statement property up into its parts
          $project: {
            brokerageName: 1, // Include the brokerageName field
            statement: "$statements",
          },
        },
      ])
      .toArray();

    eligibleStatements.forEach((statement) => {
      newChartData.forEach((chartData) => {
        if (
          chartData.month ===
          months[getMonthIndex(statement.statement.startDate)]
        ) {
          chartData[statement.brokerageName.replace(/\s+/g, "")] = parseFloat(
            statement.statement.startBalance.toString()
          );
        } else if (
          chartData.month === months[getMonthIndex(statement.statement.endDate)]
        ) {
          chartData[statement.brokerageName.replace(/\s+/g, "")] = parseFloat(
            statement.statement.endBalance.toString()
          );
        }
      });
    });

    if (eligibleStatements) {
      res.send(newChartData);
    } else {
      res
        .status(400)
        .json({ message: "Could not find investment or is empty" });
    }
  } finally {
    await client.close();
  }
});

investmentsRouter.post("/addInvestment", async (req, res) => {
  const {
    brokerageName,
    type,
    subtype,
    color,
    userId,
    startDate,
    startBalance,
    endDate,
    endBalance,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  const newInvestmentData = {
    brokerageName,
    type,
    subtype,
    color,
    userId,
    statements: [
      {
        statementId: new ObjectId(),
        startDate: new Date(startDate),
        startBalance: toDollarAmount(startBalance.toString()),
        endDate: new Date(endDate),
        endBalance: toDollarAmount(endBalance.toString()),
        depositAmount: toDollarAmount(depositAmount.toString()),
        withdrawalAmount: toDollarAmount(withdrawalAmount.toString()),
      },
    ],
  };

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investments = db.collection("Investments");

    const redundantInvestment = await investments
      .aggregate([
        {
          $match: {
            userId: userId,
            brokerageName: brokerageName,
            type: type,
            subtype: subtype,
          },
        },
        {
          $project: {
            _id: 1,
            brokerageName: 1,
            type: 1,
            subtype: 1,
          },
        },
      ])
      .toArray();

    if (redundantInvestment.length > 0) {
      return res.status(400).json({
        message:
          "Brokerage name, investment type, and investment subtype combination already exists",
      });
    }

    const newlyCreatedInvestment = await investments.insertOne(
      newInvestmentData
    );

    if (newlyCreatedInvestment) {
      res.send(newlyCreatedInvestment);
    } else {
      res.status(400).json({ message: "Error creating new investment" });
    }
  } finally {
    await client.close();
  }
});

investmentsRouter.post("/addStatement", async (req, res) => {
  const {
    investmentId,
    startDate,
    startBalance,
    endDate,
    endBalance,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestments = db.collection("Investments");

    const investmentObjectId = new ObjectId(investmentId);

    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    const statementOverlaps = await allInvestments
      .aggregate([
        { $match: { _id: investmentObjectId } },
        { $unwind: "$statements" },
        {
          $match: {
            $or: [
              {
                "statements.startDate": {
                  // newStartDate >= startDate
                  $lt: startDateDate,
                },
                "statements.endDate": {
                  // newStartDate <= endDate
                  $gt: startDateDate,
                },
              },
              {
                "statements.startDate": {
                  // newStartDate <= startDate
                  $gt: startDateDate,
                  // newEndDate > startDate
                  $lte: endDateDate,
                },
              },
              {
                "statements.startDate": {
                  // newEndDate > startDate
                  $lte: endDateDate,
                },
                "statements.endDate": {
                  // newEndDate <= endDate
                  $gt: endDateDate,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            "statements.startDate": 1,
            "statements.endDate": 1,
          },
        },
      ])
      .toArray();

    if (statementOverlaps.length > 0) {
      return res
        .status(400)
        .json({ message: "Date range overlaps with existing statements" });
    }
    const newStatementData = {
      statementId: new ObjectId(),
      startDate: startDateDate,
      startBalance: toDollarAmount(startBalance.toString()),
      endDate: endDateDate,
      endBalance: toDollarAmount(endBalance.toString()),
      depositAmount: toDollarAmount(depositAmount.toString()),
      withdrawalAmount: toDollarAmount(withdrawalAmount.toString()),
    };

    const newlyAddedStatement = await allInvestments.updateOne(
      { _id: investmentObjectId },
      { $push: { statements: newStatementData } }
    );

    if (newlyAddedStatement) {
      return res.send(newlyAddedStatement);
    } else {
      return res
        .status(400)
        .json({ message: "Error adding statement to investment" });
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
    startDate,
    endBalance,
    endDate,
    depositAmount,
    withdrawalAmount,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const allInvestments = db.collection("Investments");

    const investmentObjectId = new ObjectId(investmentId);
    const statementObjectId = new ObjectId(statementId);

    const startDateDate = new Date(startDate);
    const endDateDate = new Date(endDate);

    const statementOverlaps = await allInvestments
      .aggregate([
        { $match: { _id: investmentObjectId } },
        { $unwind: "$statements" },
        { $match: { "statements.statementId": { $ne: statementObjectId } } },
        {
          $match: {
            $or: [
              {
                "statements.startDate": {
                  // newStartDate >= startDate
                  $lt: startDateDate,
                },
                "statements.endDate": {
                  // newStartDate <= endDate
                  $gt: startDateDate,
                },
              },
              {
                "statements.startDate": {
                  // newStartDate <= startDate
                  $gt: startDateDate,
                  // newEndDate > startDate
                  $lte: endDateDate,
                },
              },
              {
                "statements.startDate": {
                  // newEndDate > startDate
                  $lte: endDateDate,
                },
                "statements.endDate": {
                  // newEndDate <= endDate
                  $gt: endDateDate,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            "statements.startDate": 1,
            "statements.endDate": 1,
          },
        },
      ])
      .toArray();

    if (statementOverlaps.length > 0) {
      return res
        .status(400)
        .json({ message: "Date range overlaps with existing statements" });
    }

    const updateResult = await allInvestments.updateOne(
      {
        _id: investmentObjectId,
        "statements.statementId": new ObjectId(statementId),
      },
      {
        $set: {
          "statements.$.startDate": startDateDate,
          "statements.$.startBalance": toDollarAmount(startBalance),
          "statements.$.endDate": endDateDate,
          "statements.$.endBalance": toDollarAmount(endBalance),
          "statements.$.depositAmount": toDollarAmount(depositAmount),
          "statements.$.withdrawalAmount": toDollarAmount(withdrawalAmount),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      res.status(400).json({
        message: "No statement found with given investment or statement ID",
      });
    } else {
      res.status(200).json({
        message: "Statement updated successfully",
      });
    }
  } catch (error) {
    console.error("Failed to update statement:", error);
    res.status(500).send("Error updating statement");
  } finally {
    await client.close();
  }
});

investmentsRouter.delete("/statement", async (req, res) => {
  const { investmentId, statementId } = req.query;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investments = db.collection("Investments");

    const result = await investments.updateOne(
      { _id: new ObjectId(investmentId) },
      { $pull: { statements: { statementId: new ObjectId(statementId) } } } // Pull (remove) the statement from the array
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({
        message:
          "No investment found with the given investment Id, or no statement found with the given statement Id",
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

investmentsRouter.delete("/investment", async (req, res) => {
  const investmentId = req.query.investmentId;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const investments = db.collection("Investments");

    const result = await investments.deleteOne({
      _id: new ObjectId(investmentId),
    });

    if (result.deletedCount === 0) {
      res.status(400).json({
        message: "No investment found with the given investment Id",
      });
    } else {
      res.json({ message: "Investment deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting investment:", error);
    res.status(500).json({ message: "Failed to delete investment" });
  } finally {
    await client.close();
  }
});

export default investmentsRouter;
