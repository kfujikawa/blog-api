// GET and POST requests should go to /blog-posts.
// DELETE and PUT requests should go to /blog-posts/:id.
// Use Express router and modularize routes to /blog-posts.
// Add a couple of blog posts on server load so you'll automatically have some data to look at when the server starts.

const express = require("express");
const morgan = require("morgan");

const app = express();

const blogRouter = require("./blogRouter");

// log the http layer
app.use(morgan("common"));

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

//route requests for /blog-posts to the express router
app.use("/blog-posts", blogRouter);

//=======LISTENER======//
app.listen(8080, () => {
	console.log("Listening on port 8080");
});