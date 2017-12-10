var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	body: String,
});

module.exports = mongoose.model("Post", postSchema);