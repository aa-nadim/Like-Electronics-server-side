const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktjwr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("LikeElectronics").collection("services");
  const reviewsCollection = client.db("LikeElectronics").collection("reviews");
  const booksCollection = client.db("LikeElectronics").collection("books");

  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      // console.log(items);
      res.send(items)
    })
  })
  app.post('/addService', (req, res) => {
    const service = req.body;
    // console.log('adding new service',service);
    servicesCollection.insertOne(service)
    .then(result => {
        // console.log("inserted count",result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })

  

  app.get('/reviews', (req, res) => {
    reviewsCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  app.post('/addReview', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })


  app.get('/orderLists', (req, res) => {
    booksCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  app.get('/bookingLists', (req, res) => {
    booksCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  app.post('/addBook', (req, res) => {
    const book = req.body;
    // console.log('adding new book ', book );
    booksCollection.insertOne(book)
    .then(result => {
      // console.log("inserted count",result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})