import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";
import path from "path";
import dotenv from "dotenv";

// Ability to utilize env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/investments", investmentsRouter);

//production script ("serves static files")
app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
