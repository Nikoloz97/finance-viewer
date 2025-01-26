import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

// production script
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/investments", investmentsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
