const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");

const should = chai.should();

const {BlogPost} = require("../models")
const {app, runServer, closeServer} = require("../app");
const {TEST_DATABASE_URL} = require("../config")

chai.use(chaiHttp);

//=================FAKE DATA CREATION===================//
function seedBlogData(){
	console.info('seeding blog post data');
	const seedData = [];

	for (let i=1; i<=5; i++){
		seedData.push(generateBlogPostData());
	}
	return BlogPost.insertMany(seedData);
}

function generateBlogPostData(){
	return {
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		title: faker.lorem.words(),
		content: faker.lorem.sentence(),
		created: faker.date.recent()
	}
}

function tearDownDb(){
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

//=================CRUD TESTS===================//
describe("BlogPost API resource", function(){
	// Activate server before tests run
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedBlogData();
	});
	afterEach(function(){
		return tearDownDb();
	});
	after(function(){
		return closeServer();
	});

	//GET
	describe('GET endpoint', function (){
		it('should return all existing blog posts', function(){
			let res;

			return chai.request(app)
				.get('/posts')
				.then(function(_res){
					res = _res;
					// console.log(res.body);
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
					return BlogPost.count();
				})
				.then(function(count){
					res.body.should.have.length.of(count);
				});
		});

		it('should return blog post with correct fields', function(){
			let resBlogPost;
			return chai.request(app)
				.get('/posts')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length.of.at.least(1);
					res.body.forEach(function(post){
						post.should.be.a('object');
						post.should.include.keys('id', 'title', 'content', 'author', 'created');
					});
					resBlogPost = res.body[0];
					return BlogPost.findById(resBlogPost.id);
				})
				//I want to talk to Alex about this
				.then(function(post){
					resBlogPost.title.should.equal(post.title);
					resBlogPost.content.should.equal(post.content);
					// console.log(post.author);
					// console.log(resBlogPost.author);
					resBlogPost.author.should.equal(post.authorName);
				});
		}); 
	}); //END describe GET endpoint 

	//POST
	describe('POST endpoint', function(){
		it('should add a new blogpost', function(){
			const newBlogPost = generateBlogPostData();
			// console.log(newBlogPost);

			return chai.request(app)
				.post('/posts')
				.send(newBlogPost)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys('id', 'title', 'content', 'author', 'created');
					res.body.id.should.not.be.null;
					return BlogPost.findById(res.body.id);
				})
				.then(function(post){
					// console.log(post);
					// console.log(newBlogPost);
					post.title.should.equal(newBlogPost.title);
					post.content.should.equal(newBlogPost.content);
					//Alex more author name issues
					// post.author.lastName.should.equal(newBlogPost.author.lastName
					// post.author.firstName.should.equal(newBlogPost.author.firstName
					// 	);
				})
		})
	});// END describe POST endpoint
	//PUT
	describe('PUT endpoint', function(){
		it('should update fields sent over', function(){
			const updateData = {
				title: 'Hello World!',
				content: 'This is better than lorem text'
			};

			return BlogPost
				.findOne()
				.then(function(post){
					updateData.id = post.id;

					return chai.request(app)
						.put(`/posts/${post.id}`)
						.send(updateData);
				})
				.then(function(res){
					res.should.have.status(201);

					return BlogPost.findById(updateData.id);
				})
				.then(function(post){
					post.title.should.equal(updateData.title);
					post.content.should.equal(updateData.content);
				});
		});
	});//END describe PUT endpoint 
	//DELETE 
	describe('DELETE endpoint', function() {
    it('should delete a post by id', function() {

      let post;

      return BlogPost
        .findOne()
        .exec()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return BlogPost.findById(post.id);
        })
        .then(_post => {
          should.not.exist(_post);
        });
    });
  });
}); //END BlogPost API resource