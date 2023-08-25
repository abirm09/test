require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const messageCollection = client.db("pathnaDB").collection("messages");

    app.post("/messages", async (req, res) => {
      const messages = req.body;
      const result = await messageCollection.insertOne(messages);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//default
app.get("/", (req, res) => {
  res.status(200).send(["Server is running"]);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
