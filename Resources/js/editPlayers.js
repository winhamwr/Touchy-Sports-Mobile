;(function($) {

/**
 * Controls the UI for editing/creating an UltimateTeam.
 *
 * @param editor_div The div where the editor fields and controls will live.
 * @param options An options object for configuring the editor.
 **/
TeamEditor = function(editor_div, options) {
	this.editor_dev = editor_div;
	this._options = options;
}

TeamEditor.prototype.init = function() {
	this.bindListeners();
}

/**
 * Bind all of the UI control listeners for handling actions.
 **/
TeamEditor.prototype.bindListeners = function() {
	
	this._options.add_player_button.click(function() {
		this.addPlayer();
	});
	this._options.clear_team_button.click(function() {
		this.clearTeam();
	});
	this._options.save_team_button.click(function() {
		this.saveTeam();
	});

}

TeamEditor.prototype.addPlayer = function() {
    var ni = document.getElementById('content');
    var numi = document.getElementById('theValue');
    var num = (document.getElementById("theValue").value -1)+ 2;
    numi.value = num;
    var divIdName = "p"+num;
    $("#content").append("<div id='"+divIdName+"'><input class='webInput' type=\"text\" value=\"Player\"</input> <a class='webButton removeLink' href=\"javascript:;\" onclick=\"removePlayer(\'"+divIdName+"\')\">Remove</a></br></br></div>");
};

TeamEditor.prototype.removePlayer = function(player) {
    $("#"+player).remove();
};

// Until we have the team creation/loading working, just going to
// generate a team and load them here for testing.
TeamEditor.prototype.createTestTeam = function() {
	var player_names = new Array('Kail','Wes','Andy','Eric','Jack','Jim','Jose',
		'Alpha','Beta','Chi','Delta','Epsilon','Gamma','Omega','Sigma','Theta','Zeta');

	var players = new Array();
	$.each(player_names, function(i, name){
		var player = new UltimatePlayer(name);
		players.push(player);
	});

	var home_team = new UltimateTeam('Stepdads', players);

	var starting_players = players.slice(0, 7);
	home_team.setStartingLineup(starting_players);

	return home_team;
};

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
	var players = new Array();
	var $playerDivs = $('#content > div');
	$.each($playerDivs, function() {
		var playerName = ($(this).children().val());
		players.push(new UltimatePlayer(playerName));
	});
	var newTeam = new UltimateTeam('StepDads', players);
	sessionStorage.setItem("CURRENT_TEAM", JSON.stringify(newTeam));
};

TeamEditor.prototype.clearTeam = function() {
	var $divs = $('#content > div');
	$.each($divs, function() {
		$(this).remove();
	});
	addPlayer();
};

/*
 * Registers the jquery plugin function
 */
$.fn.teamEditor = function(options) {

	defaults = {
		'add_player_button':		$('#buttonAdd'),
		'clear_team_button':		$('#clearTeam'),
		'save_team_button':			$('#buttonSave')
	};

	options = $.extend(defaults, options);

	var te = new TeamEditor($(this), options);
	te.init();
	return te;
};
})(jQuery);