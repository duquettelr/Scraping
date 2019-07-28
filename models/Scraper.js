var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var ScraperSchema = new Schema({
    link: String,
    title: String,
    summary: String
});

// This creates our model from the above schema, using mongoose's model method
var Scraper = mongoose.model("Scraper", ScraperSchema);

// Export the Note model
module.exports = Scraper;