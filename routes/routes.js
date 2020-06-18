// Header space

// Require Dependencies 
var express = require ("express");
var router = express.Router();
var path = require("path");

// Scraping Tools
var axios = require("axios")
var cheerio = require("cheerio");
var db = require("../models");


// Routes

// Get homepage / index.handlebars 
router.get("/", function(req, res) {
  res.render("index");
});

// Get homepage / index.handlebars 
router.get("/savedRecipes/", function(req, res) {
  res.render("saved");
});

// GET route to scrape the Real Simple Recipe Page
// Results display in /recipes (recipes.handlebars)
router.get("/recipes", function (req, res) {

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

        // console.log("\n>>>>>>>>* NEW RECIPE *<<<<<<<<<\n")
        // console.log("Title: ", result.title, "\n");
        // console.log("--------***--------\n");
        
        result.link = $(element)
        .find(".category-page-item-content a")
        .attr("href");

        // console.log("Link: ", result.link, "\n");
        // console.log("--------***--------\n");

        result.imageUrl = $(element)
        .find(".category-page-item-image a")
        .children(".lazy-image")
        .attr("data-src");

        // console.log("Image Url: ", result.imageUrl, "\n"); 
        // console.log("--------***--------\n"); 

      array.push(result);

        // console.log(result);
        // console.log(response.data);
    });
    // res.json({recipes: array});
    res.render("recipes", {recipes: array});
    // console.log(array); 
  });
});

// Push saved recipes up to the database 
router.post("/saved/", function (req, res) {
  console.log("THIS IS THE BODY OF MY REQUEST: ", req.body);
  db.Recipe.create(req.body)
      .then(function (data) {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.sendStatus(403);
      });
});

// *********** Is this right??? ********** 
// Render the saved recipes to the /saved route (saved.handlebars)
router.get("/saved/", (req, res) => {

  db.Recipe.find()
      .then(function (savedRecipes) {
        console.log(savedRecipes);
        res.json(savedRecipes);
        res.render("saved", {savedRecipes: savedRecipes});
      })
      .catch(function (err) {
          res.json(err);
      });
});

// Export routes
module.exports = router;