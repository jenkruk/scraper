// Header space 

// Require dependencies
var express = require ("express");
var mongoose = require ("mongoose");
mongoose.set('useFindAndModify', false);  
mongoose.set('useCreateIndex', true); 

// Scraping tools
var axios = require ("axios");
var cheerio = require ("cheerio");

// Require the models
var db = require("./models");

// Declare localhost port
var PORT = 3000;

// Initialize Express
var app = express();

// Import routes and give the server access to them.
var routes = require("./routes/routes");
app.use(routes);

// Configure Middleware

// Parse request body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make the public folder static
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/realSimpledb";

mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});