UltimatePlayer = function(name) {
	this.name = name
};
UltimateTeam = function(name, ultimatePlayersArray) {
	this.init(name, ultimatePlayersArray);
};

UltimateTeam.MAX_IN_PLAY = 7;

UltimateTeam.prototype.init = function(name, players) {
	this.name = name;								// team name
	this.players = new Array();		// All players on this team
	this.playersInPlay = new Array();				// an array of type Player; all players in play
};

/**
 * Set the players that are in the game to start
 */
UltimateTeam.prototype.setStartingLineup = function(starting_players) {
	this.playersInPlay = starting_players;

	// Make sure that if we added new players with the startingPlayers array,
	// they're added to the array of possible players
	var players = this.players;
	$.each(this.playersInPlay, function(i, player) {
		var player_index = $.inArray(player, players);
		if(player_index == -1) { // Not in the players list
			players.push(player);
		}
	});
};

/**
 * Get the names of all the players currently in the game.
 */
UltimateTeam.prototype.getPlayingPlayerNames = function() {
	var names = Array();
	$.each(this.playersInPlay, function(i, player) {
		names.push(player.name);
	});

	return names;
};

UltimateTeam.prototype.sub = function(leavingPlayerName, enteringPlayerName) {
	var leaving_index = this.findPlayerByName(this.playersInPlay, leavingPlayerName);
	var entering_index = this.findPlayerByName(this.players, enteringPlayerName);

	if(leavingPlayerName && leaving_index == -1) {
		console.log("Can't sub out someone that's not in the game.");
		return;
	}
	if(enteringPlayerName && entering_index){
		console.log("Can't sub in someone not on the team");
		return;
	}

	// replace the player leaving the game with the sub
	this.playersInPlay[leavingIndex] = this.players[enteringIndex]
};

// Returns the index of the player, or -1 if not found (indexOf didn't work for my player object)
UltimateTeam.prototype.findPlayerByName = function(playerArray, playerName) {
	for (var i=0;i<playerArray.length;i++) {
		if (playerArray[i].name == playerName) {
			return i;
		}
	}
	// we made it here, so we didn't find the player in the array
	return -1;
};