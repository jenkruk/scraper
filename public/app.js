// Header space 

$(document).ready(function () {

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

    // //save recipes
    // $("#saveRecipe").on("click", function(){
    //     console.log("save recipe link clicked")
    //     $.ajax({
    //         method: "GET",
    //         url: "/saved"
    //     })
    //     .done(function(data){
    //         // console.log(data);
    //     })
    //     // window.location.href = "/saved";
    // });

    $(".saveRecipe").on("click", function(event) {
        event.preventDefault();
        // console.log("save recipe link clicked")

        var title = $(this).parent().parent().find(".title").text();
        console.log("You have chosen: ", title);
        alert(title + " has been saved!");
        var link = $(this).parent().parent().find(".link").attr("href");
        var imageUrl = $(this).parent().parent().parent().find(".img").attr("src");

        var saved = {
        title: title,
        link: link,
        imageUrl: imageUrl
        };

        // console.log(saved);

    $.ajax({
        url: "/saved/",
        method: "POST",
        data: saved,
        
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

    // Render the saved recipes to the /saved route (saved.handlebars)
    // $.get("/saved", (res) => {
        
    // }).then (res => {
    //     console.log(res);
    //     // window.location.href = "/saved";
    // });

});
