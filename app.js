var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
	express 			= require("express"),
	app 				= express(),
	Post				= require("./model/post");

mongoose.connect("mongodb://localhost/kevgallery", { useMongoClient: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// Post.create({
// 	title: "Test Post",
// 	image: "http://localhost.com",
// 	description: "Sample post description",
// 	body: "This is the body of my first post"
// });

app.get("/", function(req, res) {
	Post.find({}, function(err, foundPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { posts: foundPosts });
        }
    });
});

app.get("/gallery", function(req, res) {
	Post.find({}, function(err, foundPosts) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

app.post("/gallery", function(req, res) {
	req.body.post.body = req.sanitize(req.body.post.body);
	Post.create(req.body.post, function(err, newPost) {
		if (err) {
			console.log(err);
		} else {
			console.log(newPost);
			res.redirect("/gallery");
		}
	});
});

app.get("/gallery/new", function(req, res) {
	res.render("gallery/new");
});

app.get("/gallery/:id", function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundPost);
			res.render("gallery/show", { post: foundPost });
		}
	});
}); 

app.get("/gallery/:id/edit", function(req, res) {
	res.render("gallery/edit");
});

app.listen(8000, process.env.IP, function() {
   console.log("KevGallery has started!");
});