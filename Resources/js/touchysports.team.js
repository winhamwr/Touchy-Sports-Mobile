
UltimatePlayer = function(name) {
	// See: http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");

	this.name = name;
};

UltimatePlayer.prototype.getName = function() {
	return this.name;
};

// Member data that needs to be deserialized in to objects
UltimatePlayer.NESTED_OBJECTS = {};

UltimateTeam = function(name, ultimatePlayersArray) {
	// See: http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");

	name = name || 'no-named desperados';
	ultimatePlayersArray = ultimatePlayersArray || new Array();

	this.init(name, ultimatePlayersArray);
};

UltimateTeam.DEF_MAX_IN_PLAY = 7;

UltimateTeam.prototype.init = function(name, players) {
	// Unique team name
	this.name = name;
	// All players on this team
	this.players = players;
	// an array of type Player; all players in play
	this.playersInPlay = new Array();

        // Max number of players in the game, set by gameSetup, this is always going to default to 7 for right now
        var maxPlayersInPlay_j = sessionStorage.getItem('max_players_in_play');
        this.maxPlayersInPlay = UltimateTeam.DEF_MAX_IN_PLAY;
        if (maxPlayersInPlay_j != null) {
           this.maxPlayersInPlay = JSON.parse(maxPlayersInPlay_j);
        }
};

UltimateTeam.NESTED_OBJECTS = {'players': UltimatePlayer};

UltimateTeam.prototype.toString = function() {
	return "Team: " + this.name;
};

/**
 * Get the primary identifier for this object. Should be unique.
 */
UltimateTeam.prototype.getPk = function() {
	return this.name;
}

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
		if(player_index == -1) { // Not in the players listfield.html
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
	if(enteringPlayerName && entering_index == -1){
		console.log("Can't sub in someone not on the team");
		return;
	}

	// replace the player leaving the game with the sub
	this.playersInPlay[leaving_index] = this.players[entering_index]
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

UltimateTeam.prototype.getBenchedPlayers = function() {
        var t = this;
	var playersBenched = new Array();
	var playersInPlay = t.playersInPlay;
	$.each(this.players, function(i, player) {
                var player_index = t.findPlayerByName(playersInPlay, player.name);
		if (player_index == -1) {
			playersBenched.push(player);
		}
	});
	return playersBenched;
};