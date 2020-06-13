// Header space

// Require Dependencies 
var express = require ("express");
var router = express.Router();
var path = require("path");

// Scraping Tools
var axios = require("axios")
var cheerio = require("cheerio");

// Require models
var Comment = require("../models/Comment.js");
var Recipe = require("../models/Recipe.js")

// Routes

// router.get("/", function(req, res) {
//   res.render("index");
// });

// GET route to scrape the site and write to the database
router.get("/", function (req, res) {

  axios.get("https://www.realsimple.com/food-recipes/browse-all-recipes").then(response => {
    var $ = cheerio.load(response.data);

    var array = [];

    $('.category-page-item').each((i, element) => {
        
      var result = {};

        result.title = $(element)
        .find(".category-page-item-content a")
        .children(".category-page-item-title")
        .text()
        .trim();

        console.log("\n>>>>>>>>* NEW RECIPE *<<<<<<<<<\n")
        console.log("Title: ", result.title, "\n");
        console.log("--------***--------\n");
        
        result.link = $(element)
        .find(".category-page-item-content a")
        .attr("href");

        console.log("Link: ", result.link, "\n");
        console.log("--------***--------\n");

        result.imageUrl = $(element)
        .find(".category-page-item-image a")
        .children(".lazy-image")
        .attr("data-src");

        console.log("Image Url: ", result.imageUrl, "\n");
        console.log("--------***--------\n");

      array.push(result);

        // console.log(result);
        // console.log(response.data);
    });
    // res.json({recipes: array});
    res.render("index", {recipes: array});
    console.log(array);
  });
});

// Export routes
module.exports = router;