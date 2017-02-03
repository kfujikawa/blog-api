const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise; 

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

const app = express();
const blogRouter = require("./blogRouter");
app.use(bodyParser.json());


// log the http layer
app.use(morgan("common"));

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//route requests for /posts to the express router
app.use("/posts", blogRouter);

//Start server and return promise
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};