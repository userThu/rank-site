const mongoose = require("mongoose");

/**
 * When displaying comments on a person's profile, `personid` identifies whose profile
 * and `comments` represents the list of comments on their page.
 */
const CommentSchema = new mongoose.Schema({
  personid: String,
  author: String,
  comment: String
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);
