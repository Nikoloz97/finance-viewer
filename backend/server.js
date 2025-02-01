import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Ability to utilize env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

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

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
