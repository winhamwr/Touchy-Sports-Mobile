/**
 * Save the game setup for the next page to use.
 *
 * @param team_manager A TeamManager object with the existing teams
 * @param dest_page A string representing the page that should load the
 * game setup values.
 */
function saveGameSetup(team_manager, dest_page) {
    // save opposing team name
    var opposingTeamName = $('#opposingTeamName').val();
    sessionStorage.setItem(dest_page+'__opposing_team_name', opposingTeamName);

    // save disc possession
    var possession = $('#possession').val();
    sessionStorage.setItem(dest_page+'__user_has_possession', possession);

    // save field direction
    var direction = $('#direction').val();
    sessionStorage.setItem(dest_page+'__user_attacking_right', direction);

    // save total players in play
    var totalPlayersInPlay = $('#totalPlayers').val();
    sessionStorage.setItem(dest_page+'__max_players_in_play', totalPlayersInPlay);

	var user_team_name = $('#user_team').val();

	var user_team = team_manager.getTeam(user_team_name);
	user_team.setStartingLineup(user_team.players.slice(0, totalPlayersInPlay));

	team_manager.addTeam(user_team);
	team_manager.save();

	sessionStorage.setItem(dest_page+'__user_team_name', user_team.name);
}
