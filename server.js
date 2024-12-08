import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/investments", investmentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
