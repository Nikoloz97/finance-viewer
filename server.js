require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 5000;
const uri = process.env.MONGODB_URI;

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("FinanceViewer").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db("FinanceViewer");
    const users = db.collection("Users");

    const user = await users.findOne({ username, password });

    if (user) {
      res.send(user);
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } finally {
    await client.close();
  }
});
