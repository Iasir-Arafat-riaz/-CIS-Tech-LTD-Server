const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("CIS-Tech-LTD");
    const users = database.collection("customerInfor");

    // add customer details from here
    app.post("/customerDetails", async (req, res) => {
      console.log(req.body);
      const result = await users.insertOne(req.body);
      res.json(result);
    });
    //Find all customer data from here
    app.get("/customerDetails", async (req, res) => {
      const result = await users.find({}).toArray();
      res.json(result);
    });

    //remove customer data from database
    app.delete("/customerDetails/:id",async(req,res)=>{
        const selectedInfo = req.params.id;
        console.log(selectedInfo);
        const remove = { _id: ObjectId(selectedInfo) };
        const result = await users.deleteOne(remove);
        res.json(result);
    })

    //Registration


  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("CIStechLTD-Server Running");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
