import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";
import path from "path";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const port = process.env.PORT;

// production script
app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/investments", investmentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
