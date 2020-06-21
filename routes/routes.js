// Header space

// Require Dependencies 
var express = require ("express");
var router = express.Router();
var path = require("path");

// Scraping Tools
var axios = require("axios")
var cheerio = require("cheerio");
var db = require("../models");
const Recipe = require("../models/Recipe");


// Routes

// Get homepage / index.handlebars 
router.get("/", function(req, res) {
  res.render("index");
});

// GET route to scrape the Real Simple Recipe Page
// Results display in /recipes
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
    res.render("recipes", {recipes: array});
    // console.log(array); 
  });
});

// Push saved recipes up to the database 
router.post("/saved/", function (req, res) {
  // console.log("THIS IS THE BODY OF MY REQUEST: ", req.body);
  db.Recipe.create(req.body)
    .then(function (data) {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.sendStatus(403);
    });
});

// Send the saved recipes to the front
router.get("/saved/", (req, res) => {

  db.Recipe.find()
    .then(function (savedRecipes) {
      // console.log(savedRecipes);
      // res.json(savedRecipes);
      res.render("saved", {savedRecipes: savedRecipes});
    })
    .catch(function (err) {
        res.json(err);
    });
  });

  // Route for deleting a recipe from the db
  router.delete("/saved/:id", function (req, res) {
    db.Recipe.deleteOne({ _id: req.params.id })
      .then(function (dbRecipe) {
          res.json(dbRecipe);
      })
      .catch(function (err) {
          res.json(err);
      });
  });

// *************** BELOW IS IN TESTING ********************************** 

  //route to get a specific recipe
  router.get("/recipes/:id",function(req,res){
   return db.Recipe.findOne({_id: req.params.id})
   //and all it's notes
   .populate("note")
   .then(function(recipedb){
      console.log("THIS IS LINE 115 OF ROUTES.JS: ", recipedb)
       res.json(recipedb)
   })
   .catch(function(err){
       res.json (err)
       console.log(err)
   })
  })

  //route to allow user to create notes and be saved on the database as well as update it on the recipe collection
  router.post("/recipes/:id", function(req,res){
      db.Note.create(req.body)
      .then(function(Notedb){
          console.log("THIS IS LINE 128 OF ROUTES.JS: ", Notedb)
          return db.Recipe.findOneAndUpdate({_id:req.params.id},{$set:{note:Notedb._id}},{new: true});
      })
      .then(function(recipedb){
          console.log(recipedb)
          res.json(recipedb)
      })
      .catch(function(err){
          res.json(err)
      })
  })

  //route to delete a note
  router.delete("/recipes/:id", function(req,res){
    db.Note.deleteOne({_id:req.params.id})
    .then(Notedb=>{
        console.log("Will this delete the note?")
        console.log(Notedb)
        return db.Recipe.updateOne({_id:req.params.id},{$pullAll:{notes:Notedb._id}})
    }).then(recipeDb=>{
        console.log("It did delete the note.")
        console.log(recipeDb)
    })
    .catch(err=>{
        console.log(err)
    });
  });


// Export routes
module.exports = router;