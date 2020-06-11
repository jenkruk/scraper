// Header space

// Require Dependencies 
var express = require ("express");
var router = express.Router();
var axios = require("axios")

// Require models
var db = require("../models")

// Routes

router.get("/", function (err, res) {
  db.Recipes.find({"saved": false})
    .then(function () {
      console.log(Recipedb.length);
      // console.log(Recipedb);
        if (Recipedb.length !== 0) {
          res.render("index", { recipes: Recipedb });
        } else {
          res.render("norecipes");
        }
      }).catch(function (err) {
          res.json(err);
    });
});

// GET route to scrape the site and write to the database
router.get("/scrape", function (req, res) {

  axios.get("https://www.realsimple.com/food-recipes/browse-all-recipes").then(urlResponse => {
    const $ = cheerio.load(urlResponse.data);

    $('.category-page-item').each((i, element) => {
        
        const title = $(element)
        .find(".category-page-item-content a")
        .children("h3.category-page-item-title");

        console.log("Title: ", title.text());

        const description = $(element)
        .find(".category-page-item-content .category-page-item-description");

        console.log("Description: ", description.text());
        
        const link = $(element)
        .find(".category-page-item-content a")
        .attr("href");

        console.log("Link: ", link);

        const imageUrl = $(element)
        .find(".category-page-item-image a")
        .children(".lazy-image")
        .attr("data-src");

        console.log("Image Url: ", imageUrl);
        console.log("_________________________________")

    });

});
});

// GET route to retrieve recipes from the database 
router.get("/recipes", function (req, res) {

  db.Recipes.find({})
      .then(function (Recipedbs) {
          res.json(Recipedbs);
      })
      .catch(function (err) {
          res.json(err);
      });
});

router.get("/clear-everything", function (req, res) {
  db.Recipes.remove({}, function (err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log("removed all recipes");
      }
  });

  db.Comment.remove({}, function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log("Removed all comments");
      }
  })
  res.redirect("/");
});

router.get("/clear-all", function (req, res) {
  db.Recipes.deleteMany({"saved": false}, function (err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log("removed all except for saved recipe");
      }
  });
  res.redirect("/");
})

router.post("/saved/:id", function (req, res) {
  db.Recipes.updateOne( { _id: req.params.id }, { saved: true })
  .then(function(Recipedb) {
      console.log(Recipedb);
      // res.json(Recipedb);
  });
})

router.get("/saved", function (req, res){
  db.Recipes.find({"saved": true})
  .then(function(DBArt){
      if (DBArt.length !== 0) {
          res.render("saved", { recipes: Recipedb});
      } else {
          res.render("nosavedrecipes");
      }
  }).catch(function(err) {
      res.json(err);
  });
});

router.post("/deleteone/:id", function (req, res) {
  db.Recipes.deleteOne( { _id: req.params.id }, function (err, doc) {
      if (err) {
          console.log(err);
      } else{
          console.log("Deleted saved recipe");
      }
    });
  });

router.get("/recipes/:id", function (req, res) {
  db.Recipes.findOne({ _id: req.params.id })
  .populate("comment")
  .then(function (Recipedb) {
      res.json(Recipedb);
      // console.log( "wha: " + DBArt);
  })
  .catch(function(err){
      res.json(err);
  });
});

router.post("/recipes/:id", function (req, res) {
  var comment = req.body;

  console.log("Comment: " + JSON.stringify(comment));
  // console.log("test: " + req);
  db.Comment.create(comment)
  .then(function (DBCom) {
      console.log(DBCom);
      return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: DBCom._id } }, { new: true });
  })
  .then(function (Recipedb) {
      console.log(Recipedb);
      res.json(Recipedb);
  })
  .catch(function (err) {
      res.json(err);
  });
});

//comments route here
router.get("/comments/:id", function (req, res) {
  db.Comment.findOne({ _id: req.params.id })
      .then(function (Recipedb) {
          res.json(Recipedb);
      })
      .catch(function (err) {
          res.json(err);
      });
});

//delete comment route
router.post("/delete-comment/:id", function (req, res) {
  console.log(req.params.id);
  db.Comment.deleteOne({_id: req.params.id})
  .then(function (dbArts) {
      res.render("saved",{
          recipes: dbArts
      })
  });
})

// Export routes
module.exports = router;