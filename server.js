const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const usersInfo = database.collection("customerInfor");
    const users = database.collection("users");

    // add customer details from here
    app.post("/customerDetails", async (req, res) => {
      console.log(req.body);
      const result = await usersInfo.insertOne(req.body);
      res.json(result);
    });
    //Find all customer data from here
    app.get("/customerDetails", async (req, res) => {
      console.log(req.query);
      const cursor = usersInfo.find({})
      const page=req.query.page;
      const size =parseInt( req.query.size);
      let result;
      const count =await cursor.count()
      if(page){
        result = await cursor.skip(page*size).limit(size).toArray();
      }
      else{
        result = await cursor.toArray();
      }
      
      
      res.json({count,result});
    });

    //remove customer data from database
    app.delete("/customerDetails/:id", async (req, res) => {
      const selectedInfo = req.params.id;
      console.log(selectedInfo);
      const remove = { _id: ObjectId(selectedInfo) };
      const result = await usersInfo.deleteOne(remove);
      res.json(result);
    });

    //trying to emplement authentication with jwt token
    //Registration
    // app.post("/register", async (req, res) => {
    //   //use bcrypt for secure user password
    //   const hashPass = await bcrypt.hash(req.body.pass, 10);
    //   console.log(req.body);
    //   const registerUser = {
    //     name: req.body.name,
    //     email: req.body.email,
    //     pass: hashPass,
    //   };
    //   const result = await users.insertOne(registerUser);
    //   res.json(result);
    // });
    //Login with jwt
    // app.post("/login", async (req, res) => {
    //   console.log(req.body);
    //   const user = await users.find({ email: req.body.email });
    //   if (user && user.length > 0) {
    //     const isValidPassword = await bcrypt.compare(
    //       req.body.pass,
    //       user.pass
    //     );
    //     console.log(isValidPassword,user);
    //     if (isValidPassword) {
    //       //generate token
    //       const token = jwt.sign(
    //         { email: user.email, userId: user._id },
    //         process.env.JWT_SECRET,
    //         {
    //           expiresIn: "1h",
    //         }
    //       );
    //       res.status(200).json({
    //         "access-token": token,
    //         message: "login successful",
    //       });
    //     } else {
    //       res.status(401).json({ "error": "Authentication failed" });
    //     }
    //   } else {
    //     res.status(401).json({ "error": "Authentication failed" });
    //   }
    // });
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
