const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../app");

const should = chai.should();

chai.use(chaiHttp);

//=================BLOG TEST===================//
describe("/blog-posts", function(){
	// Activate server before tests run
	before(function(){
		return runServer();
	});
	
	// Close server after tests run 
	after(function(){
		return closeServer();
	})

	//Test GET request
	it("should list blog posts on GET", function(){
		return chai.request(app)
			.get("/blog-posts")
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a("array");

				res.body.length.should.be.at.least(1);

				const expectedKeys = ['title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item){
					item.should.be.a("object");
					item.should.include.keys(expectedKeys);
				});
			});
	});//End GET test

	//Test POST request
	it("should add a new blog post item on POST", function(){
		const newItem = {
			title: "Another Blog Post", 
			content: "Content for this blog post", 
			author:"Arya Stark", 
			publishDate: "1/25/2017"
		};
		return chai.request(app)
			.post("/blog-posts")
			.send(newItem)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a("object");
				res.body.should.include.keys("title", "content", "author", "publishDate");
				res.body.title.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
			});
	});//End POST test

	//Test PUT request
	it("should update blog post on PUT", function(){
		const updateData = {
			title: "foo",
			content: "bar",
			author: "bizz",
			publishDate: "1/3/2017"
		};

		return chai.request(app)
			.get("/blog-posts")
			.then(function(res){
				updateData.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${updateData.id}`)
					.send(updateData);
			})
			.then(function(res){
				res.should.have.status(204);
			});
	});//End PUT test
	//Test DELETE request
	it("should delete blog post on DELETE", function(){
		return chai.request(app)
		.get("/blog-posts")
		.then(function(res){
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`);
		})
		.then(function(res){
			res.should.have.status(204);
		});
	});
}); //End describe blog