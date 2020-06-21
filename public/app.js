// Header space 

$(".saveRecipe").show();
$(".recipeSaved").hide();
$(".deletNote").hide();

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

    // ***************** BELOW IS IN TESTING ***************** 

    //event to allow user to see the notes if there are any
$(".recipeNotes").on("click", function(){
    // console.log("The Recipe Notes button has been clicked");

    var id=$(this).data("id")
    // console.log("The Recipe ID is: "+id)

    $(".notes").empty();

    $.ajax({
        url:"/recipes/" + id,
        method:"GET"
    }).then(function(data){
        // console.log("TESTING: ", data)
   $(".notes").append(
        `
        <h5 class="modal-title" style="padding: 3vh 2vw 3vh 2vw">${data.title}</h5>
            <div class="modal-body">
            <form>
                <div class="form-group">
                    <textarea class="form-control" id="noteBody" placeholder="Add your note here."style="margin-bottom: 3vh; padding-left: 2vw"></textarea>
                </div>
            </form>
        <div class="modal-footer">
            <button type="button" class="btn saveNote" data-id=${data._id}>Save Note</button>
        </div>`)
    if(data.note){
        $("#noteBody").val(data.note.body);
        $(".modal-footer").append(`
        <button type="button" class="btn btn deleteNote" data-id=${data.note._id} data-dismissal="modal">Delete Note</button>
        `)
        $(".deletNote").show();
        // console.log(data.note.body)
        // $("#noteBody").val(data.note.body)
    }
    });

});

//Save a note
$(".saveNote").on("click", function() {
    // console.log("Save Note Button has been clicked");
    var id=$(this).attr("data-id");
    console.log("Line 115 of app.js: .saveNote has been clicked")
    $.ajax({
        url:"/recipes/" +id,
        method:"Post",
        data:{
            body:$("#noteBody").val()
        }
    }).then(function(data){
        console.log("Line 123 of app.js: ", data)
       $(".notes").empty();
    });
    $("#noteBody").val("");
})

//delete a note
$(".deletNote").on("click", function(){
 
       var id=$(this).data("id");
        console.log("Delete has been clicked")
    $.ajax({
        url:"/deleteNote/" +id,
        method: "DELETE"
       
    }).then(function(){
        console.log("Successfully deleted note.")
        $("#noteBody").val(" ")

    }).fail(function(err){
        console.log(err)
    })
})


}); // End document ready
