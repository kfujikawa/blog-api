const uuid = require('uuid');
const mongoose = require('mongoose');

//Schema to represent a blog
const blogSchema = mongoose.Schema({
  // the `name` property is String type and required
  title: {
    type: String, 
    required: [true, "Title field is required."]
  },
  content: {
    type: String, 
    required: [true, "Content field is required."]
  },
  author: {
    firstName: {
      type: String, 
      required: [true, "First name field is required"]
    },
    lastName: {
      type: String,
      required: [true, "Last name field is required"]
    }
  },
  publishDate: {
    type: Date, 
    default: Date.now
  },
});

//Virtuals?

// Creates a new Mongoose model "Post" that uses the blogSchema.  "Post" represents the collection in the db.  Mongo converts the name to lowercase and pluralizes ("db.posts")

module.exports = mongoose.model("Post", blogSchema); 