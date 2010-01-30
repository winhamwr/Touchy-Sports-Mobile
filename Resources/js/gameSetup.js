function saveGameSetup(home_team) {
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

    // set starting lineup for UltimateT
//    var newTeam = new UltimateTeam('StepDads', players);
//    newTeam.setStartingLineup(newTeam.players.slice(0,newTeam.maxPlayersInPlay));

    setStartingLineupGS(home_team, totalPlayersInPlay);
}

function loadGameSetup() {
    alert('it works');
}

function setStartingLineupGS(home_team, totalPlayersInPlay) {
    console.log(totalPlayersInPlay);
    home_team.setStartingLineup(home_team.players.slice(0,totalPlayersInPlay));
    sessionStorage.setItem('CURRENT_TEAM', JSON.stringify(home_team));
}