const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const {BlogPosts} = require("./models");

//When root of this router is called with GET, return all blog posts
router.get('/posts', (req, res) => {
  BlogPost
    .find()
    .exec()
    .then(blogPosts => {
      res.json({
        blogPosts: blogPosts.map((blogPosts) => blogPosts.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

//GET by id 
router.get('/posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .exec()
    .then(blogPosts => res.json(blogPosts.apiRepr()))
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

// When a new blog post is created, check for required fields (title, content, author, publishDate).  If not log error and return 400 status code.  If required fields are there, add new blog post to BlogPosts and return it with 201. 
router.post('/posts', jsonParser, (req, res) => {
  // ensure `title`, `content`, `author`, `publishDate` are in request body
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
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
      content: req.body.title,
      author: req.body.author,
      publishDate: req.body.publishDate
    .then(
      blogPosts => res.status(201).json(blogPosts.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
      })
    });
});

//When DELETE request comes in with an id in path; try to delete from BlogPosts.  
router.delete('/posts/:id', (req, res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
})

// catch-all endpoint if client makes request to non-existent endpoint
router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// When a PUT request comes in check for required fields. 
// Check for item id in url path, and item id in update item
// log error if any issues and send back status code 400. 
// Else call `BlogPosts.update` with updated item.
router.put('/posts/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author', 'publishDate'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;