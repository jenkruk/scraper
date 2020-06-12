// Header space

// Require Dependencies 
var express = require ("express");
var router = express.Router();
var path = require("path");

// Scraping Tools
var axios = require("axios")
// var request = require("request")
var cheerio = require("cheerio");

// var url='https://www.realsimple.com/food-recipes/browse-all-recipes'
// var headers = {'Accept': 'text/html'}
// var response = axios.get(url, headers=headers)
// var response = (response.status_code);
// console.log(response);

// Require models
var Comment = require("../models/Comment.js");
var Recipe = require("../models/Recipe.js")

// Routes

router.get("/", function(req, res) {
  res.redirect("/recipes");
});

// GET route to scrape the site and write to the database
router.get("/scrape", function (req, res) {

  axios.get("https://www.realsimple.com/food-recipes/browse-all-recipes").then(urlResponse => {
    const $ = cheerio.load(urlResponse.data);

    $('.category-page-item').each((i, element) => {
        
        const title = $(element)
        .find(".category-page-item-content a")
        .children("h3.category-page-item-title")
        .text()
        .trim();

        console.log("\n>>>>>>>>* NEW RECIPE *<<<<<<<<<\n")
        console.log("Title: ", title, "\n");
        console.log("--------***--------\n");

        const description = $({element})
        .find(".category-page-item-content")
        .children(".category-page-item-description")
        .text();

        console.log("Description: ", description, "\n");
        console.log("--------***--------\n");
        
        const link = $(element)
        .find(".category-page-item-content a")
        .attr("href");

        console.log("Link: ", link, "\n");
        console.log("--------***--------\n");

        const imageUrl = $(element)
        .find(".category-page-item-image a")
        .children(".lazy-image")
        .attr("data-src");

        console.log("Image Url: ", imageUrl, "\n");
        console.log("--------***--------\n");

  // request("https://www.realsimple.com/food-recipes/browse-all-recipes", function(error, response, html){
  //   var $ = cheerio.load(html);
    var titlesArray = [];

  //   $('.category-page-item').each(function(i, element) {
  //     var result={};

  //     result.title = $(this)
  //     .children(".category-page-item-content a h3.category-page-item-title")
  //     .text();

  //     console.log("Title: ", result.title);

  //     result.description = $(this)
  //     .children(".category-page-item-content .category-page-item-description")
  //     .text();

  //     console.log("Description: ", result.description);

  //     result.link = $(this)
  //     .children(".category-page-item-content a")
  //     .attr("href");

  //     console.log("Link: ", result.link);

  //     result.imageUrl = $(this)
  //     .children(".category-page-item-image a .lazy-image")
  //     .attr("data-src");

  //     console.log("Recipe Image: ", result.imageUrl);
  //     console.log("======== END RECIPE =======\n")

      if(title !== "" && description !== "" && link !== "" && imageUrl !== ""){

        if(titlesArray.indexOf(title) == -1) {
          titlesArray.push(title);

          Recipe.count({ title: title }, function(err, test) {
            if (test === 0) {
              var entry = new Recipe(title);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              })
            }
          })
        } else {
          console.log("Article already exists.");
        }
      } else {
        // console.log("Article not saved\n");
      }
    });
    res.redirect("/");
  });
});

// INDEX page
// router.get("/", function (err, res) {
//   db.Recipes.find({"saved": false})
//     .then(function () {
//       console.log(Recipedb.length);
//       // console.log(Recipedb);
//         if (Recipedb.length !== 0) {
//           res.render("index", { recipes: Recipedb });
//         } else {
//           // res.render("norecipes"); // implement later
//           res.render("/recipes")
//         }
//       }).catch(function (err) {
//           res.json(err);
//     });
// });

router.get("/recipes", function(req, res){
    Recipe.find().sort({ _id: -1 }).exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var recp = { recipe: doc };
        res.render("index", recp);
      }
    });
});

router.get("/recipes-json", function(req, res) {
  Recipe.find({}, function(err, doc){
    if (err){
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

var create = (req, res) => {
  const newEntry = req.body;
  Recipe.create(newEntry, (e, newEntry) => {
    if(e) {
      console.log(e);
      res.sendStatus(500);
     } else {
        res.send(newEntry);
    }
  });
};

// Recipe.create(function(req, res){
//   title: res.body.title,
//   description: res.body.description,
//   link: res.body.link,
//   imageUrl: res.body.imageUrl
// }, function (err) {
//   if (err) return handleError(err);
//   // saved!
// });

// GET route to retrieve json
// router.get("/recipes", function (req, res) {

//   db.Recipes.find({})
//       .then(function (Recipedb) {
//           res.json(Recipedb);
//       })
//       .catch(function (err) {
//           res.json(err);
//       });
// });

// router.get("/clear-everything", function (req, res) {
//   db.Recipes.remove({}, function (err, doc) {
//       if (err) {
//           console.log(err);
//       } else {
//           console.log("removed all recipes");
//       }
//   });

//   db.Comment.remove({}, function(err, doc) {
//       if (err) {
//           console.log(err);
//       } else {
//           console.log("Removed all comments");
//       }
//   })
//   res.redirect("/");
// });

// router.get("/clear-all", function (req, res) {
//   db.Recipes.deleteMany({"saved": false}, function (err, doc) {
//       if (err) {
//           console.log(err);
//       } else {
//           console.log("removed all except for saved recipe");
//       }
//   });
//   res.redirect("/");
// })

// router.post("/saved/:id", function (req, res) {
//   db.Recipes.updateOne( { _id: req.params.id }, { saved: true })
//   .then(function(Recipedb) {
//       console.log(Recipedb);
//       // res.json(Recipedb);
//   });
// })

// router.get("/saved", function (req, res){
//   db.Recipes.find({"saved": true})
//   .then(function(DBArt){
//       if (DBArt.length !== 0) {
//           res.render("saved", { recipes: Recipedb});
//       } else {
//           res.render("nosavedrecipes");
//       }
//   }).catch(function(err) {
//       res.json(err);
//   });
// });

// router.post("/deleteone/:id", function (req, res) {
//   db.Recipes.deleteOne( { _id: req.params.id }, function (err, doc) {
//       if (err) {
//           console.log(err);
//       } else{
//           console.log("Deleted saved recipe");
//       }
//     });
//   });

// router.get("/recipes/:id", function (req, res) {
//   db.Recipes.findOne({ _id: req.params.id })
//   .populate("comment")
//   .then(function (Recipedb) {
//       res.json(Recipedb);
//       // console.log( "wha: " + DBArt);
//   })
//   .catch(function(err){
//       res.json(err);
//   });
// });

// router.post("/recipes/:id", function (req, res) {
//   var comment = req.body;

//   console.log("Comment: " + JSON.stringify(comment));
//   // console.log("test: " + req);
//   db.Comment.create(comment)
//   .then(function (DBCom) {
//       console.log(DBCom);
//       return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: DBCom._id } }, { new: true });
//   })
//   .then(function (Recipedb) {
//       console.log(Recipedb);
//       res.json(Recipedb);
//   })
//   .catch(function (err) {
//       res.json(err);
//   });
// });

//comments route here
// router.get("/comments/:id", function (req, res) {
//   db.Comment.findOne({ _id: req.params.id })
//       .then(function (Recipedb) {
//           res.json(Recipedb);
//       })
//       .catch(function (err) {
//           res.json(err);
//       });
// });

//delete comment route
// router.post("/delete-comment/:id", function (req, res) {
//   console.log(req.params.id);
//   db.Comment.deleteOne({_id: req.params.id})
//   .then(function (dbArts) {
//       res.render("saved",{
//           recipes: dbArts
//       });
//   });
// })

// Export routes
module.exports = router;