$(document).ready(function(){

    $("#buttonSave").click(function() {
        saveGameSetup();
    });
});

function saveGameSetup() {
    // save opposing team name
    var opposingTeamName = $('#opposingTeamName').val();
    console.log(opposingTeamName);
    sessionStorage.setItem('opposing_team_name', opposingTeamName);

    // save disc possession
    var possession = $('#possession').val();
    console.log(possession);
    sessionStorage.setItem('team_possession', possession);

    // save field direction
    var direction = $('#direction').val();
    console.log(direction);
    sessionStorage.setItem('my_team_direction', direction);

    // save total players in play
    var totalPlayersInPlay = $('#totalPlayers').val();
    console.log(totalPlayersInPlay);
    sessionStorage.setItem('max_players_in_play', totalPlayersInPlay);
}

function loadGameSetup() {
    alert('it works');
}