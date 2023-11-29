const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');


//middleware

app.use(cors());
app.use(express.json());




const uri = "mongodb://0.0.0.0:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("realEstateDb").collection("users");


    //jwt related api
    app.post('/jwt',async(req,res)=>{
      const user = req.body;
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'1h'
      });
      console.log(token)
      // res.send({token:token})
      res.send({token}); //short hand
    })



     //user related api
     app.get('/users', async(req,res)=>{
      
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post('/users',async (req,res)=>{
      const user = req.body;
      // insert email if user dosent exist 
      // you can do this many ways (1.email unique, 2.upsert 3.simple checking)
      const query = {email:user.email}
      // console.log(query)
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({message:'user already exists',insertedId:null})
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('real state sitting')
})

app.listen(port,()=>{
    console.log(`Real State is sitting on port ${port}`);
})