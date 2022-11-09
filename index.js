const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gtp2h2a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollection = client.db('doc-port').collection('services');
    const reviewCollection = client.db('doc-port').collection('reviewers');

    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.send(result);
    })

    app.get('/home', async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query).limit(3);
        const result = await cursor.toArray();
        res.send(result);

    })

    //review section

    app.post('/review/:id', async (req, res) => {
        const data = req.body;
        const result = await reviewCollection.insertOne(data);
        res.send(result);
        console.log(data);

    })

    app.get('/review/:id', async (req, res) => {
        const id = req.params.id;
        const query = {};
        const cursor = reviewCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })



}
run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('Doctor server is running')
})

app.listen(port, () => {
    console.log(`Dpctor Port server running on ${port}`);
})