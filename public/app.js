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
    console.log("The Recipe Notes button has been clicked")

    var id=$(this).data("id")
    console.log("The Recipe ID is: "+id)

    $(".notes").empty();

    $.ajax({
        url:"/recipes/" + id,
        method:"GET"
    }).then(function(data){
        console.log("WE ARE TESTING THIS!!!: ", data)
   $(".notes").append(`
        <div class=modal-header">
        <h5 class="modal-title">${data.title}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-lable="Close">
        <span aria-hidden="true">&times;</span> </button>
        </div>
        <div class="modal-body">
        <form>
        <div class="form-group">
        <label for="text" class="col-form-label">Enter your note(s) here:</label>
        <textarea class="form-control" id="noteBody"></textarea>
        </div>
        </form>
        <div class="modal-footer">
        
        <button type="button" class="btn btn-success saveNote" data-id=${data._id}>Save Note</button>
        </div>
        </div>
   `)
    if(data.note){
        $(".modal-footer").append(`
        <button type="button" class="btn btn-secondary deleteNote" data-id=${data.note._id} data-dismissal="modal">Delete Note</button>
        `)
        console.log(data.note.body)
        $("#noteBody").val(data.note.body)
    }
    });

});

//add a note and save it 
$(".saveNote").on("click", function(){
    var id=$(this).data("id");
    $.ajax({
        url:"/recipes/" +id,
        method:"Post",
        data:{
            body:$("#noteBody").val()
        }
    }).then(function(data){
       console.log(data)
    })
    $("#noteBody").val("")
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
