const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const Post = require("./models");

//GET
router.get("/", (req, res) => {
 Post
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

 Post
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
 Post
   .create(req.body)
   .then(post => res.status(201).end())
   .catch(error => {
     res.status(500).json({
       message: "Internal server error"
     });
   });
});

//DELETE
router.delete('/:id', (req, res) => {
 Post
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

   Post
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

module.exports = router;