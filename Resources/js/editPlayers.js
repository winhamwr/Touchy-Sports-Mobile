$(document).ready(function(){
    $("#buttonAdd").click(function() {
        addPlayer();
    });
	$('#clearTeam').click(function() {
		clearTeam();
	});
	$('#buttonSave').click(function() {
		saveTeam();
	});
	loadTeam();
});

function addPlayer() {
    var ni = document.getElementById('content');
    var numi = document.getElementById('theValue');
    var num = (document.getElementById("theValue").value -1)+ 2;
    numi.value = num;
    var divIdName = "p"+num;
    $("#content").append("<div id='"+divIdName+"'><input type=\"text\" value=\"Player\"</input> <a href=\"javascript:;\" onclick=\"removePlayer(\'"+divIdName+"\')\">Remove</a></div>");
};

function removePlayer(player) {
    $("#"+player).remove();
};

// Until we have the team creation/loading working, just going to
// generate a team and load them here for testing.
function createTestTeam() {
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

function loadTeam() {
	var currentTeam;
	var db = new db_controller();
	if (db.gameExists()) {
		function foo(){};
		var tempGame = new foo();
		db.loadGame(tempGame);
		currentTeam = tempGame['home_team'];
	} else {
		currentTeam = createTestTeam();
	}
	
	var playerCount = -1;
	$.each(currentTeam.players, function() {
			playerCount++;
			addPlayer();
			var $lastDiv = $('#content > div:last input');
			var playerName = currentTeam.players[playerCount].name;
			$lastDiv.val(playerName);
		});
};

function saveTeam() {
	var players = new Array();
	var $playerDivs = $('#content > div');
	$.each($playerDivs, function() {
		var playerName = ($(this).children().val());
		players.push(new UltimatePlayer(playerName));
	});
	var newTeam = new UltimateTeam('StepDads', players);
	newTeam.setStartingLineup(newTeam.players.slice(0,UltimateTeam.MAX_IN_PLAY));
	localStorage.setItem("CURRENT_TEAM", JSON.stringify(newTeam));
};

function clearTeam() {
	var $divs = $('#content > div');
	$.each($divs, function() {
		$(this).remove();
	});
	addPlayer();
};