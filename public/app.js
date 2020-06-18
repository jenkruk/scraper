// Header space 

$(".saveRecipe").show();
$(".recipeSaved").hide();

$(document).ready(function () {

    // initiate modal for saved.handlebars
    $('.modal').modal();

    //scrape recipes
    $("#scrape").on("click", function(){
        $.ajax({
            method: "GET",
            url: "/recipes"
        })
        .done(function(data){
        // console.log(data);
        })
        window.location.href = "/recipes";
    });

    // save a recipe
    $(".saveRecipe").on("click", function(event) {
        event.preventDefault();

        // console.log("save recipe link clicked")

        var title = $(this).parent().parent().find(".title").text();
        console.log("You have chosen: ", title);
        var link = $(this).parent().parent().find(".link").attr("href");
        var imageUrl = $(this).parent().parent().parent().find(".img").attr("src");

        var saved = {
        title: title,
        link: link,
        imageUrl: imageUrl
        };

        $(this).parent().find(".saveRecipe").hide();
        $(this).parent().find(".recipeSaved").show();


        // console.log(saved);

    //send saved recipe to the html saved.handlebars
    $.ajax({
        url: "/saved/",
        method: "POST",
        // data: saved
    }).then(function(data) {
        console.log("THIS IS WHAT MY AJAX SAVED: ", saved)
        console.log("TESTING LINE 51: ", data)
        var alert = 
        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        This recipe has been saved!
        </div>`
        $(this).find(".saveRecipe").append(alert);
        })
        .fail(function (err) {
            console.log(err);
        });
    });

    // console.log("TESTING MY AJAX FROM APP.JS LINE 40: ", saved)

});
