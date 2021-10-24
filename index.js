const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const objectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// momgodb code here

const uri = "mongodb+srv://mongodb1:UdUjj4dgLPblxCo0@cluster0.rxher.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("foodmaster");
      const usersCollection = database.collection("users");
    //   get api
    app.get('/users', async(req, res) =>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users)
    })
    // singel api get
    app.get('/users/:id', async (req,res) =>{
        const id = req.params.id;
        const query = {_id: objectId(id)}
        const user = await usersCollection.findOne(query);
        console.log('hello ')
        res.send(user) 
    })
    //   post api
      app.post('/users', async(req,res)=>{
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser)
          console.log('new user information', req.body);
          console.log('added user', result);
          res.json(result);
      });
    //   update api 
        app.put('/users/:id', async (req,res) =>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: objectId(id)};
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                  name: updatedUser.name,
                  email: updatedUser.email
                }
              };
            const result = await usersCollection.updateOne(filter,updateDoc,option)  
            console.log('updating', id);
            res.json(result)
        })
        //delete api
        app.delete('/users/:id', async (req,res) =>{
            const id = req.params.id;
            const query = {_id: objectId(id)};
            const result = await usersCollection.deleteOne(query);
            console.log('deleting uder', result)
            console.log('delete id', id);
            res.json(result)

        })   


    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);







app.get('/', (req,res)=>{
    res.send('respos running')
});



app.listen(port,()=>{
    console.log('running server', 5000);
})