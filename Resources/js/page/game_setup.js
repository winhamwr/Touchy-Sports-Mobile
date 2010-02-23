/**
 * Save the game setup for the next page to use.
 *
 * @param team_manager A TeamManager object with the existing teams
 * @param dest_page A string representing the page that should load the
 * game setup values.
 */
function saveGameSetup(dest_page) {
    // save opposing team name
    var opposing_team_name = $('#opposing_team_name').val();
    sessionStorage.setItem(dest_page+'__opposing_team_name', opposing_team_name);

    // save disc possession
    var possession_val = $('#user_has_possession').val();
	var user_has_possession = false;
	if(possession_val == '1'){
		user_has_possession = true;
	}
	var user_has_possession_s = JSON.stringify(user_has_possession);
    sessionStorage.setItem(dest_page+'__user_has_possession', user_has_possession_s);

    // save field direction
    var direction_val = $('#user_attacking_right').val();
	var user_attacking_right = false;
	if(user_attacking_right ==  '1'){
		user_attacking_right = true;
	}
	var user_attacking_right_s = JSON.stringify(user_attacking_right);
    sessionStorage.setItem(dest_page+'__user_attacking_right', user_attacking_right_s);

    // save total players in play
    var total_players = $('#max_players_in_play').val();
	var max_players_in_play_s = JSON.stringify(total_players);
    sessionStorage.setItem(dest_page+'__max_players_in_play', max_players_in_play_s);

	//User Team name
	var user_team_name = $('#user_team').val();
	sessionStorage.setItem(dest_page+'__user_team_name', user_team_name);
}
