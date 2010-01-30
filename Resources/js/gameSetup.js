$(document).ready(function(){

    $("#buttonSave").click(function() {
        saveGameSetup();
    });
});

function saveGameSetup() {
    // save total players in play
    var totalPlayersInPlay = parseInt($('#totalPlayers').val());
    console.log(totalPlayersInPlay);
    sessionStorage.setItem('max_players_in_play', totalPlayersInPlay);
    //$('#opposingTeamName').val()
    //$('#possession').val()
    //$('#direction').val()
    //$('#totalPlayers').val()
}