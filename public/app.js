// Header space 

$(document).ready(function () {

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

});