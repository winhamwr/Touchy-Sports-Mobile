
$(document).ready(function(){
    $("#buttonAdd").click(function() {
        addPlayer();
    });
});


function addPlayer() {
    console.log("addPlayer");
    var ni = document.getElementById('content');
    var numi = document.getElementById('theValue');
    var num = (document.getElementById("theValue").value -1)+ 2;
    numi.value = num;
    var divIdName = "my"+num+"Div";
    $("#content").append("<input type=\"text\" id=divIdName value=\"Name\"</input> <a href=\"javascript:;\" onclick=\"removePlayer(\'"+divIdName+"\')\">Remove</a><p></p>");
}

function removePlayer(player) {
    console.log("removePlayer");
    $("#"+player).remove();
}