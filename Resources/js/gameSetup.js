$(document).ready(function(){

    $("#buttonSave").click(function() {
        saveGameSetup();
    });
});

function saveGameSetup() {
    var totalPlayersInPlay = parseInt($('#totalPlayers').val());
    sessionStorage.setItem('max_players_in_play', totalPlayersInPlay);
    //$('#opposingTeamName').val()
    //$('#possession').val()
    //$('#direction').val()
    //$('#totalPlayers').val()
}