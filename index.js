const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
  const adminsCollection = client.db("LikeElectronics").collection("admins");

  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })
  app.post('/addService', (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })
  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    servicesCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
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
  app.post('/bookingLists', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email })
    .toArray((err, admin) => {
      booksCollection.find(email)
      .toArray((err, documents) => {
        // console.log(email,documents)
        res.send(documents);
      })
    })
  })
  app.post('/addBook', (req, res) => {
    const book = req.body;
    booksCollection.insertOne(book)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email })
        .toArray((err, doctors) => {
            res.send(doctors.length > 0);
        })
  })


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})