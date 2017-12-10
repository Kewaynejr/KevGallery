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

// Get Homepage
app.get("/", function(req, res) {
	Post.find({}, function(err, foundPosts) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { posts: foundPosts });
        }
    });
});

// Get Gallery Page, not implemented right now
app.get("/gallery", function(req, res) {
	Post.find({}, function(err, foundPosts) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

// Send new Posts to this route in order to save
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

// Show Form to create a new Post
app.get("/gallery/new", function(req, res) {
	res.render("gallery/new");
});

// Get one particular post by its ID
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

// Send updates to a particular post to this route
app.put("/gallery/:id", function(req, res) {
	Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
		if (err) {
			console.log(err);
			res.redirect("/gallery");
		} else {
			res.redirect("/gallery/" + req.params.id);
		}
	});
});

// Get Form that is used to update a particular post
app.get("/gallery/:id/edit", function(req, res) {
	Post.findById(req.params.id, function(err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("gallery/edit", { post: foundPost });
        }
	});
});

// Delete particular post Route
app.delete("/gallery/:id", function(req, res) {
	Post.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log(err);
			res.redirect("/gallery");
		} else {
			res.redirect("/gallery");
		}
	});
})

// Server statement, adjust this to fit different environments
app.listen(8000, process.env.IP, function() {
   console.log("KevGallery has started!");
});