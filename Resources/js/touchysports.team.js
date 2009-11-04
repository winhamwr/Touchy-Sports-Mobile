var MAX_INPLAY = 7;	// 7 players allowed on the field for Ultimate Frisbee

if(typeof(homeTeam) == 'undefined'){
	var homeTeam = null;
}

ultimateTeam = function(name, coach, ultimatePlayersArray) {
	this.init(name, coach, ultimatePlayersArray);
};

ultimateTeam.prototype.init = function(name, coach, ultimatePlayersArray) {
	this.name = name;								// team name
	this.coach = coach;								// coach's name
	this.playersInPlay = new Array();				// an array of type Player; all players in play
	this.playersBenched = new Array();				// an array of type Player; all players warming the bench
	this.playersInjured = new Array();				// an array of type Player; all broken players

	// Set the first 7 players in play by default. This should be a stored lineup
	// or set by the user before the game.  Should also set injured players, if
	// there is any.
	if (ultimatePlayersArray != null) {
		var player;
		var numPlayers = 0;
		for (player in ultimatePlayersArray) {
			if (numPlayers < MAX_INPLAY) {
				this.playersInPlay[numPlayers] = ultimatePlayersArray[player];
			} else {
				this.playersBenched[numPlayers-MAX_INPLAY] = ultimatePlayersArray[player];
			}
			numPlayers++;
		}
	}
	
	if (this.playersInPlay < MAX_INPLAY) {
		// TODO: Not enough players to play the game.
	}
};

ultimateTeam.prototype.sub = function(leavingPlayerName,enteringPlayerName) {
	var leavingIndex = findPlayerByName(this.playersInPlay,leavingPlayerName);
	var enteringIndex = findPlayerByName(this.playersBenched,enteringPlayerName);
	
	if (leavingIndex != -1) {
		if (enteringIndex != -1) {
			// store the player leaving the game
			var leaving = this.playersInPlay[leavingIndex];
			// replace the player leaving the game with the sub
			this.playersInPlay[leavingIndex] = this.playersBenched[enteringIndex]
			// remove the sub from the benchedPlayers array and add the player that left the game
			this.playersBenched.splice(enteringIndex, 1, leaving);
		} else {
			console.log('Team.sub() called, player entering the game not found.');	// TODO:
		}
	} else {
		console.log('Team.sub() called, player leaving the game not found.');	// TODO:
	}
};

// Returns the index of the player, or -1 if not found (indexOf didn't work for my player object)
function findPlayerByName(playerArray,playerName) {
	for (var i=0;i<playerArray.length;i++) {
		if (playerArray[i].name == playerName) {
			return i;
		}
	}
	// we made it here, so we didn't find the player in the array
	return -1;
};

function loadHomeTeam() {
	/* TODO: Load the home team from localStorage and remove the test data function */
	createTestTeam();
};

function createTestTeam() {
	var playerNames = new Array('Kail','Wes','Andy','Eric','Jack','Jim','Jose',
		'Alpha','Beta','Chi','Delta','Epsilon','Gamma','Omega','Sigma','Theta','Zeta');
	var teamPlayers = new Array();
	for (i=0; i<playerNames.length; i++) {
		teamPlayers[i] = new ultimatePlayer(i,playerNames[i],i,ULTIMATE_STATUS_NOTSET,playerNames[i]);
	}
	homeTeam = new ultimateTeam('Stepdads','Mini Me',teamPlayers);
};

$(document).ready(function() {
	loadHomeTeam();
});