const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const {BlogPosts} = require("./models");

//Add initial blog post
BlogPosts.create(
	"First Blog Post", "Content for the first blog post", "Jon Snow", "1/1/2017"
	);
BlogPosts.create(
  "Second Blog Post", "Content for the second blog post", "Jane Snow", "1/2/2017"
  );

//When root of this router is called with GET, return all blog posts
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// When a new blog post is created, check for required fields (title, content, author, publishDate).  If not log error and return 400 status code.  If required fields are there, add new blog post to BlogPosts and return it with 201. 
router.post('/', jsonParser, (req, res) => {
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
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

//When DELETE request comes in with an id in path; try to delete from BlogPosts.  
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post item \`${req.params.ID}\``);
	res.status(204).end();
})

// When a PUT request comes in check for required fields. 
// Check for item id in url path, and item id in update item
// log error if any issues and send back status code 400. 
// Else call `BlogPosts.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id and request body id must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate,
  });
  res.status(204).json(updatedItem);
})

module.exports = router;