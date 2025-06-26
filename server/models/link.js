const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  personid: String,
  instagram_link: String,
  tiktok_link: String,
  other_link: String
});

// compile model from schema
module.exports = mongoose.model("link", LinkSchema);
