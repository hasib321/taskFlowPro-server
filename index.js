const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgwhtfa.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const newTaskCollection = client.db("taskFlowPro").collection("newTask");

    //NEW TASK RELATED API

    //service update
    app.put("/newTasks/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateNewService = {
        $set: {
          title: user.title,
          description: user.description,
          deadlines: user.deadlines,
          priority: user.priority,
          email: user.email,
          userName: user.userName,
          status: user.status,
        },
      };
      const result = await newTaskCollection.updateOne(
        filter,
        updateNewService,
        options
      );
      res.send(result);
    });
    app.delete("/newTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/newTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newTaskCollection.findOne(query);
      res.send(result);
    });

    app.get("/newTasks", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = newTaskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/newTasks", async (req, res) => {
      const newTasks = req.body;
      const result = await newTaskCollection.insertOne(newTasks);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TaskFlowPro server is running");
});
app.listen(port, () => {
  console.log(`TaskFlowPro server is running on port ${port}`);
});
