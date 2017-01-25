const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const should = chai.should();

chai.use(chaiHttp);

//=================BLOG TEST===================//
describe("blog-posts", function(){
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
	});//END GET TEST

	//Test POST request
	it("should add a blog post item on POST", function(){
		const newItem = 
	})
}) //END DESCRIBE BLOG