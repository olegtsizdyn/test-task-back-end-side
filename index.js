require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const fs = require('fs');

const MONGO_DB_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;
// const DOMAIN_URL = process.env.SERVER_URL;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(fileupload({
  useTempFiles : true,
  tempFileDir : './upload'
}));

app.get('/', (req, res)=>{
  res.send('Get');
})

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
})

// app.post("/api/randomimage", (req, res) => {
//   if (!req.files || !req.files.file) {
//     res.send('File field is required');
//     return;
//   }

//   db.collection('images')
//     .insertOne({
//       name: req.files.file.name,
//       size: req.files.file.size,
//       contentType: req.files.file.mimetype,
//       image: new Buffer.from(fs.readFileSync(req.files.file.tempFilePath).toString('base64'), 'base64'),
//       url: req.protocol + '://' + req.get("host") + '/images/' + req.files.file.name,
//     })
//     .then(() => {
//       res.send('Image has benn upload successfully');

//       fs.rmSync('./upload', { recursive: true, force: true });
//     })
//     .catch(() => {
//       res.send('Something went wrong with upload file');
//     })
// });


// app.get('/api/randomimage', (req, res)=>{
//   db.collection('images').find().toArray()
//     .then(collection => {
//       randomImage = collection[Math.floor((Math.random() * collection.length))]

//       res.send(randomImage)
//     })
//     .catch(() => {
//       res.send('Something went wrong with upload file');
//     })
// })

// mongoose.connect(MONGO_DB_URL);
// const db = mongoose.connection;
// db.on('error', (error) => {
//   console.log(`Connection to database failed`, error)
// });
// db.once('open', () => {
//   console.log(`Connection to database successfully`)

//   app.listen(PORT, () => {
//     console.log(`Server started at ${PORT}`)
//   })
// });
