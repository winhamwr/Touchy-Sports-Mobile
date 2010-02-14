$(document).ready(function(){
	updateTeamCount();
	initManageData();
	initManageTeams();
	initGameSetup();
});

///
///	home (main page)
///

/**
 *	Sets the counter next to "Manage Teams" to the number of teams currently saved.
 */
function updateTeamCount() {
	var tm = new TeamManager();
	$($'team_count').html(tm.getNumTeams);
};

///
///	manage_data
///

/**
 *	Builds the manage_data page (div id: manage_data).
 */
function initManageData() {
	var $games = $('#manage_data_games');
	var $db = new db_controller();
	var game_ids = $db.getStoredGames();
	var used_ids = [];
	
	$games.html();	// clear the games
	
	$.each(game_ids, function(i, val){
		if($.inArray(val, used_ids) != -1){
			return;
		}
		used_ids.push(val);

		$db.continueGame(val);
		var game = $db._getGameData();
		var game_str = JSON.stringify(game);
		$games.append('<p><strong>'+val+'</strong></p>');
		$games.append('<li><textarea placeholder="Textarea" id="game_'+val+'">'+game_str+'</textarea></li>');
	});

	$('#reset_game').click(function(event){
		$db.startNewGame();
	});
	$('#reset_all').click(function(event){
		localStorage.clear();
	});
};

///
///	manage_teams
///

/**
 *	Builds the manage_teams page (div id: manage_teams).
 */
function initManageTeams() {
	loadTeamNames();
};

function loadTeamNames() {
	var tm = new TeamManager();
	var teams = tm.getTeamNames();
	//var teamsHtml = '';
	$('#manage_teams_list').html();	// clear the current list
	console.log(teams);
	for (var i in teams) {
		//teamsHtml+='<li class="arrow"><a href="#edit_team" id="'+teams[i]+'">'+teams[i]+'</a></li>';
		var teamName = teams[i];
		var teamTag = 'edit_team_' + teamName;
		var numPlayers = tm.getNumPlayers(teamName);
		
		var teamHtml = '<li class="arrow">';	// create the row
		teamHtml+='<a href="#edit_team" id="'+teamTag+'">'+teamName+'</a>'	// add the link
		teamHtml+='<small class="counter" id="team_player_count_"'+teamName'">'+numPlayers+'</small></li>'		// add the player counter
		
		$('#manage_teams_list').append(teamHtml)
		$('#'+teamTag).click(function() {
			console.log(this.html());
			initEditTeam(this.html());
		});
	}
	//$('#manage_teams_list').html(teamsHtml);
};

///
///	game_setup
///

/**
 *	Builds the game_setup page (div id: game_setup).
 */
function initGameSetup() {
};

///
///	edit_team
///

/**
 *	Builds the edit_team page (div id: edit_team).
 */
function initEditTeam(teamName) {
	
};

function addPlayer() {
};

function removePlayer() {
};

function clearTeam() {
};

function saveTeam() {
};