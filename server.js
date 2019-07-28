// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var db = require("./models");

// Initialize Express
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });

var PORT = process.env.PORT || 8230;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("index");
});


axios.get("http://news.northeastern.edu/#_ga=2.4402810.854542969.1564274475-2026376497.1564274475").then(function (response) {

    var $ = cheerio.load(response.data);

    var results = [];
    $("a.hp__tease_text").each(function (i, element) {

        var link = $(element).attr("href")
        var title = $(element).children("h3").children(".tease__hed__link").text();
        var summary = $(element).children("p").text();

        results.push({
            link: link,
            title: title,
            summary: summary
        });
        console.log(results);


        results.forEach(element => {
            db.Scraper.create({ link: element.link, title: element.title, summary: element.summary })
                .then(function (dbScraper) {
                    console.log(dbScraper);
                })
                .catch(function (err) {
                    console.log(err.message);
                });
        });

        app.get("/api/scraper", function (req, res) {
            db.Scraper.find({})
                .then(function (dbScraper) {
                    // If all Users are successfully found, send them back to the client
                    res.json(dbScraper);
                })
                .catch(function (err) {
                    // If an error occurs, send the error back to the client
                    res.json(err);
                });
        });

        //     $("#article-cards").append(` <div class="card">
        //     <div class="card-body">
        //         This is some text within a card body.
        //     </div>
        // </div>`)
    });

    console.log(results);
});

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});