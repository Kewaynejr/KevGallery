var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
	express 			= require("express"),
	app 				= express()
	Post				= require("./model/post");

mongoose.connect("mongodb://localhost/kevgallery", { useMongoClient: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.render("index");
});

// app.get("/gallery", function(req, res) {
// 	res.render("gallery/index");
// });

app.post("/gallery", function(req, res) {
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

app.listen(8000, process.env.IP, function() {
   console.log("KevGallery has started!");
});