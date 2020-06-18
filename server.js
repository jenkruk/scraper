// Header space 

// Require dependencies
var express = require ("express");
var mongoose = require ("mongoose");
var logger = require("morgan");
var path = require("path");

// Initialize Express
var app = express();

app.use(logger("dev"));

// Configure Middleware

// Parse request
// Define your routes after you parse your data!!!
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Import routes and give the server access to them.
var routes = require("./routes/routes");
app.use(routes);


// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make the public folder static
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/realSimpledb";

mongoose.connect("mongodb://localhost/realSimpledb");


mongoose.connection.on("error", console.error.bind(console, "connection error: "));
mongoose.connection.once("open", function() {
    console.log("Connected to Mongoose!");
});

// Declare localhost port
var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});