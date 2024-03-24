const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.port || 5000;

//middelware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bistro Boss server running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9cgyp9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const bistro_BoSS_DB = client.db("bistro_boss_DB").collection("menu");
    const bistro_Boss_Review = client
      .db("bistro_boss_DB")
      .collection("reviews");
    const bistro_Boss_Cart = client.db("bistro_boss_DB").collection("cart");

    //Cart section

    app.post("/api/cart", async (req, res) => {
      const item = req.body;
      const result = await bistro_Boss_Cart.insertOne(item);
      res.send(result);
    });

    // app.get("/api/cart", async (req, res) => {
    //   const result = await bistro_Boss_Cart.find().toArray();
    //   res.send(result);
    // });

    app.get("/api/cart", async (req, res) => {
      const uid = req.query.userId;
      const query = { userId: uid };
      const result = await bistro_Boss_Cart.find(query).toArray();
      res.send(result);
    });

    app.get("/api/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bistro_Boss_Cart.findOne(query);
      res.send(result);
    });

    app.put("/api/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateProduct = req.body;
      console.log(updateProduct);
      const product = {
        $set: {
          totalPrice: updateProduct.totalPrice,
          itemQuantity: updateProduct.itemQuantity,
        },
      };
      const result = await bistro_Boss_Cart.updateOne(filter, product);
      res.send(result);
    });

    app.delete("/api/cart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bistro_Boss_Cart.deleteOne(filter);
      res.send(result);
    });

    app.delete("/api/cart", async (req, res) => {
      const uid = req.query.userId;
      const query = { userId: uid };
      const result = await bistro_Boss_Cart.deleteMany(query);
      res.send(result);
    });

    app.get("/api/menus", async (req, res) => {
      const result = await bistro_BoSS_DB.find().toArray();
      res.send(result);
    });

    app.get("/api/reviews", async (req, res) => {
      const result = await bistro_Boss_Review.find().toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Explore on ther hitting on port ${port}`);
});
