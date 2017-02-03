const uuid = require('uuid');
const mongoose = require('mongoose');

//Schema to represent a blog
const blogSchema = mongoose.Schema({
  // the `name` property is String type and required
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  publishDate: {type: Date, default: Date.now},
});

//Virtuals?

//Instance method available on all instances of the model.  This is to limit what is exposed.  
blogSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.author,
    publishDate: this.publishDate
  };
}

const blogPost = mongoose.model("BlogPost", blogSchema);

module.exports = {blogPost}; 