const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: String,
  votes: [String],
  imagesrc: String,
  commentCount: Number
});

// compile model from schema
module.exports = mongoose.model("person", PersonSchema);
