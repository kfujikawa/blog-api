const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const BlogPost = require("./models");

//GET
router.get("/", (req, res) => {
 BlogPost
   .find()
   .select("title content author publishDate")
   // .where("author.firstName").equals("Wilson")
   .then(posts => {
     res.status(200).json(posts);
   }).catch(err => {
     console.error(err);
     res.status(500).json({
       message: "Internal server error"
     });
   });
});

//GET by id
router.get("/:id", (req, res) => {

 BlogPost
   .findById(req.params.id)
   .then(post => {
     res.status(200).json(post);
   }).catch(err => {
       res.status(500).json({
         message: "Internal server error"
       });
     });
});

//POST
router.post("/", jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost)
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

//DELETE
router.delete('/:id', (req, res) => {
 BlogPost
   .findByIdAndRemove(req.params.id)
   .then(post => res.status(204).end())
   .catch(err => res.status(500).json({
     message: "Internal server error"
   }));
});



// PUT
router.put("/:id", (req, res) => {

 const toUpdate = {};

 if (req.params.id && req.body._id && (req.params.id === req.body._id)) {
   ['title', 'content', 'author', 'publishDate'].forEach(field => {
     if (field in req.body) {
       toUpdate[field] = req.body[field];
     }
   });

   BlogPost
     .findByIdAndUpdate(req.params.id, {
       $set: toUpdate
     })
     .then(post => {
       res.status(201).json(post);
     })
     .catch(err => {
       res.status(500).json({
         message: 'Internal server error'
       });
     });

 } else {

   res.status(400).json({
     message: `Request path id (${req.params.id}) and request body id (${req.body._id}) must match`
   });

 }

});

// Catch-all endpoint
router.use("*", (req, res) => {
 res.status(404).json({
   message: "Not Found"
 });
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
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

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {runServer, app, closeServer, router};