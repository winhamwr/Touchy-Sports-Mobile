$(document).ready(function(){
	updateTeamCount();
	initManageData();
	initManageTeams();
	initGameSetup();
	initEditTeam();
});

///
///	home (main page)
///

/**
 *	Sets the counter next to "Manage Teams" to the number of teams currently saved.
 */
function updateTeamCount() {
	var tm = new TeamManager();
	$('#team_count').html(tm.getNumTeams());
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
	
	// bind events
	$('#add_team').click(function() {
		addTeam();
	});
};

function loadTeamNames() {
	var tm = new TeamManager();
	var teams = tm.getTeamNames();
	
	$('#manage_teams_list').html();	// clear the current list
	for (var i in teams) {
		var teamName = teams[i];
		var teamTag = 'edit_team_' + teamName;
		var numPlayers = tm.getNumPlayers(teamName);
		
		var teamHtml = '<li class="arrow">';	// create the row
		teamHtml+='<a href="#edit_team" id="'+teamTag+'">'+teamName+'</a>';	// add the link
		teamHtml+='<small class="counter" id="team_player_count_"'+teamName+'">'+numPlayers+'</small></li>';		// add the player counter
		console.log(teamHtml);
		$('#manage_teams_list').append(teamHtml);
		$('#'+teamTag).click(function() {
			console.log(this.html());
			initEditTeam(this.html());
		});
	}
};

function updatePlayerCount(teamName) {
	var tm = new TeamManager();
	var numPlayers = tm.getNumPlayers(teamName);
	$('#'+'team_player_count_'+teamName).html(numPlayers);
};

function addTeam() {
	$('#edit_team_title').html('New Team');
	$('#edit_team_name').val('');
	$('#edit_team_list').html('<li><input type="text" name="name" placeholder="Player name" /></li>');
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
function initEditTeam() {
	$('#add_player').click(function() {
		addPlayer();
	});
	
	$('#edit_team_back').click(function() {
		saveTeam();
	});
};

/**
 *	Updates the edit_team div (page) to show the team to be edited.
 */
function updateEditTeam(teamName) {
};

function addPlayer() {
};

function removePlayer() {
};

function clearTeam() {
};

function saveTeam() {
	// get the players
	var players = new Array();
	var $player_inputs = $('#edit_team_list > input');
	$.each($player_inputs, function() {
		var playerName = ($(this).val());
		/* TODO: don't allow a blank player name? */
		players.push(new UltimatePlayer(playerName));
	});
	
	// get the team name
	var team_name = $('#edit_team_name').val();
	/* TODO: don't allow a blank team name? */

	var newTeam = new UltimateTeam(team_name, players);

	var tm = new TeamManager();
	tm.addTeam(newTeam);
	tm.save();
	sessionStorage.setItem("CURRENT_TEAM", JSON.stringify(newTeam));
};