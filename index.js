require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const MONGO_DB_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(fileupload({
  useTempFiles : true,
  tempFileDir : './upload'
}));
app.use(cors({
  origin: 'https://test-task-front-end-side.herokuapp.com'
}));

mongoose.connect(MONGO_DB_URL);
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(`Connection to database failed`, error)
});
db.once('open', () => {
  console.log(`Connection to database successfully`)

  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
  })
});

app.post("/api/randomimage", (req, res) => {
  if (!req?.files || !req?.files?.file) {
    res.send({
      success: false,
      message: 'File field is required'
    });
  } else {
    db.collection('images')
      .insertOne({
        name: req.files.file.name,
        size: req.files.file.size,
        contentType: req.files.file.mimetype,
        image: new Buffer.from(fs.readFileSync(req.files.file.tempFilePath).toString('base64'), 'base64'),
      })
      .then(() => {
        res.send({
          success: true,
          message: 'Image has been upload successfully'
        });

        fs.rmSync('./upload', { recursive: true, force: true });
      })
      .catch(() => {
        res.send({
          success: false,
          message: 'Something went wrong with uploading file'
        });
      })
  }
});

app.get('/api/randomimage', (req, res) => {
  db.collection('images').find().toArray()
    .then(collection => {
      if (!collection.length) {
        res.send({
          success: false,
          message: 'Image collection empty'
        });
      } else {
        const randomImage = collection[Math.floor((Math.random() * collection.length))]

        res.send({
          success: true,
          randomImage
        })
      }
    })
    .catch(() => {
      res.send({
        success: false,
        message: 'Something went wrong with getting file'
      });
    })
})

app.delete('/api/randomimage/:id', (req, res) => {
  if (!req?.params?.id) {
    res.send({
      success: false,
      message: 'Image id is required'
    });
  } else {
    db.collection('images').deleteOne({_id: mongoose.Types.ObjectId(req.params.id)})
    .then(() => {
      res.send({
        success: true,
        message: 'Image has been deleted successfully'
      });
    })
    .catch(() => {
      res.send({
        success: false,
        message: 'Something went wrong with deleting file'
      });
    })
  }
})