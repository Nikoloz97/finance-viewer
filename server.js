import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/UserRoutes.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
