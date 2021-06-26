// Header space 

// Require dependencies
var express = require ("express");
var mongoose = require ("mongoose");
var logger = require("morgan");
var path = require("path");
var cors = require('cors');

// Initialize Express
var app = express();

app.use(logger("dev"));

// Configure Middleware

// Parse request
// Define your routes after you parse your data!!!
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors())

// Import routes and give the server access to them.
var routes = require("./routes/routes");
app.use(routes);


// Set Handlebars
var hbs = require('handlebars');
var exphbs = require("express-handlebars");
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

app.engine("handlebars", exphbs({ 
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess (hbs)
}));

app.set("view engine", "handlebars");

// Make the public folder static
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/realSimpledb";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})


mongoose.connection.on("error", console.error.bind(console, "connection error: "));
mongoose.connection.once("open", function() {
    console.log('Connected to Mongoose')
});

// Declare localhost port
var PORT = process.env.PORT || 3000

// Start the server
app.listen(PORT, function() {
    console.log(`App running on port http://localhost:${PORT}`);
});