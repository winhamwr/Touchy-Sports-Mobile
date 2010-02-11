;(function($) {

/**
 * Controls the UI for editing/creating an UltimateTeam.
 *
 * @param editor_div The div where the editor fields and controls will live.
 * @param options An options object for configuring the editor.
 **/
TeamEditor = function(editor_div, options) {
	this.editor_div = editor_div;
	this._options = options;

	// Configure control selectors
	this.add_player_button = this._options.add_player_button;
	this.save_team_button = this._options.save_team_button;
}

TeamEditor.prototype.init = function() {
	this.bindListeners();
	this.addPlayer();
}

TeamEditor.PLAYER_CONTROLS = '#player_controls';
TeamEditor.TEAM_NAME_SELECTOR = 'input#team_name';
TeamEditor.PLAYERS_SELECTOR = TeamEditor.PLAYER_CONTROLS + ' input';

/**
 * Bind all of the UI control listeners for handling actions.
 **/
TeamEditor.prototype.bindListeners = function() {
	var te = this;
	
	this.add_player_button.click(function() {
		te.addPlayer();
	});

    $('#start_game').click(function() {
		te.saveTeam();
	});

	this.editor_div.find(TeamEditor.PLAYER_CONTROLS +' .remove').live('click', function(){
		te.removePlayer($(this));
	});

};

TeamEditor.prototype.addPlayer = function(player_name) {
	player_name = player_name || 'Player';
	var player_input = '<li>' +
		'<input type="text" value="'+player_name+'" /> ' +
		'<button class="remove">Remove</button>' +
		'</li>'; 

	var controls_list = this.editor_div.find(TeamEditor.PLAYER_CONTROLS);
	controls_list.append(player_input);
};

TeamEditor.prototype.removePlayer = function(remove_button) {
	var player_li = remove_button.parent();
	player_li.remove();
};

/**
 * Remove all of the player inputs from the form.
 **/
TeamEditor.prototype._clearPlayers = function() {
	$(TeamEditor.PLAYERS_SELECTOR).remove();
	$('ul > li').remove();	// catch the stragglers
}

//function loadTeam() {
//	var currentTeam;
//	var db = new db_controller();
//	if (db.gameExists()) {
//		function foo(){};
//		var tempGame = new foo();
//		db.loadGame(tempGame);
//		currentTeam = tempGame['home_team'];
//	} else {
//		currentTeam = createTestTeam();
//	}
//
//	var playerCount = -1;
//	$.each(currentTeam.players, function() {
//			playerCount++;
//			addPlayer();
//			var $lastDiv = $('#content > div:last input');
//			var playerName = currentTeam.players[playerCount].name;
//			$lastDiv.val(playerName);
//		});
//};

TeamEditor.prototype.saveTeam = function() {
	
	var players = this._getPlayers();
	var team_name = this._getTeamName();
	var newTeam = new UltimateTeam(team_name, players);

	var tm = new TeamManager();
	tm.addTeam(newTeam);
	tm.save();
	sessionStorage.setItem("CURRENT_TEAM", JSON.stringify(newTeam));

	return tm;
};

/**
 * Get the team name from the form.
 * 
 * @return String with the team name
 */
TeamEditor.prototype._getTeamName = function() {
	return $(TeamEditor.TEAM_NAME_SELECTOR).val();
}

/**
 * Get all of the player inputs from the form.
 *
 * @return Array of UltimatePlayer objects
 */
TeamEditor.prototype._getPlayers = function() {
	var players = new Array();
	var $player_inputs = $(TeamEditor.PLAYERS_SELECTOR);
	$.each($player_inputs, function() {
		var playerName = ($(this).val());
		players.push(new UltimatePlayer(playerName));
	});

	return players;
}

TeamEditor.prototype.click = function() {

}

/*
 * Registers the jquery plugin function
 */
$.fn.teamEditor = function(options) {

	defaults = {
		'add_player_button':		$('#buttonAdd'),
		'save_team_button':			$('#buttonSave')
	};

	options = $.extend(defaults, options);

	var te = new TeamEditor($(this), options);
	te.init();
	return te;
};
})(jQuery);