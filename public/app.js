// Header space 

$(".saveRecipe").show();
$(".recipeSaved").hide();
var elem;

$(document).ready(function () {

    // initiate modal for saved.handlebars
    elem = $('.modal').modal();

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

        console.log("save recipe link clicked")

        var title = $(this).parent().parent().find(".title").text();
        console.log("You have saved: ", title);
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

        //send saved recipe to the front
        $.ajax({
            url: "/saved/",
            method: "POST",
            data: saved
        }).fail(function (err) {
            console.log(err);
        });
    }); // end save recipe

    // Delete recipe from page and db
    $(".unsaveBtn").on("click", function () {
        var thisId = $(this).attr("data-id");
        // console.log("/saved/" + thisId)
    $.ajax({
        method: "DELETE",
        url: "/saved/" + thisId,
    }).then(function () {
            location.reload();
    }).catch(function (err) {
            console.log(err);
        });
    });

//event to allow user to see the notes if there are any or make their own note
$(".recipeNotes").on("click", function(){
    // console.log("The Recipe Notes button has been clicked");

    var id=$(this).data("id")
    // console.log("The Recipe ID is: "+id)

    $(".notes").empty();
    $("#noteInput").empty();

    $.ajax({
        url:"/recipes/" + id,
        method:"GET"
    }).then(function(data){
        // console.log("TESTING: ", data)
        $(".modal-title").text(data.title);
        $("#saveNote").attr("data-recipeID", data._id);

        data.note.forEach(function(e){
        $(".notes").append(
        `<p>${e.body}
        <button class="deleteNote" data-id=${e._id}>X</button>
        </p>`)
        })

    });

});

//Save a note
$(document).on("click", "#saveNote", function() {
    // console.log("Save Note Button has been clicked");
    var id=$(this).attr("data-recipeID");
    console.log("Line 115 of app.js: #saveNote has been clicked")
    $("#modal1").modal("close");
    $.ajax({
        url:"/recipes/" +id,
        method:"Post",
        data:{
        body:$("#noteInput").val()
        }
    }).then(function(data){
        console.log("Line 123 of app.js: ", data);
        $(".newNotes").append($(this.body));
       $(".notes").empty();
    });
    $("#noteInput").val("");
    // $("#modal1").refresh();
})

//delete a note
$(document).on("click", ".deleteNote", function(){

       var id=$(this).data("id");
        console.log("Delete has been clicked")
        $("#modal1").modal("close");
    $.ajax({
        url:"/recipes/" +id,
        method: "DELETE"
       
    }).then(function(){
        console.log("Successfully deleted note.");
        // $("#noteInput").val("");
        // $(".notes").val("");
        // location.reload();
    }).fail(function(err){
        console.log(err)
    })
})

}); // End document ready
