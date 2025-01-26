import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes.js";
import investmentsRouter from "./routes/InvestmentsRoutes.js";
import path from "path";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://tacos.azurewebsites.net", // Replace with your frontend URL
  })
);

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/investments", investmentsRouter);

// production script ("serves static files")
// app.use(express.static("./build"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "build", "index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
