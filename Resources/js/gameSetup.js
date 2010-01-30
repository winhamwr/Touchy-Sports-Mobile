function saveGameSetup(home_team) {
    // save opposing team name
    var opposingTeamName = $('#opposingTeamName').val();
    sessionStorage.setItem('opposing_team_name', opposingTeamName);

    // save disc possession
    var possession = $('#possession').val();
    sessionStorage.setItem('team_possession', possession);

    // save field direction
    var direction = $('#direction').val();
    sessionStorage.setItem('user_team_direction', direction);

    // save total players in play
    var totalPlayersInPlay = $('#totalPlayers').val();
    sessionStorage.setItem('max_players_in_play', totalPlayersInPlay);

    setStartingLineupGS(home_team, totalPlayersInPlay);
}

function loadGameSetup() {
    alert('it works');
}

function setStartingLineupGS(home_team, totalPlayersInPlay) {
    home_team.setStartingLineup(home_team.players.slice(0,totalPlayersInPlay));
    sessionStorage.setItem('CURRENT_TEAM', JSON.stringify(home_team));
}