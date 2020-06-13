// Header space 

$(document).ready(function () {

    $("#scrape").on("click", function(){
        $.ajax({
            method: "GET",
            url: "/"
        })
        .done(function(data){
            // console.log(data);
        })
    });

});