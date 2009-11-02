var MAX_INPLAY = 7;	// 7 players allowed on the field for Ultimate Frisbee

/*
	Team constructor
*/
function Team(name, coach, players) {
	this.name = name;					// team name
	this.coach = coach;					// coach's name
	this.players = players;				// an array of type Player; all players on the team
	this.playersInPlay = new Array();	// an array of type Player; all players in play
	this.playersBenched = new Array();	// an array of type Player; all players warming the bench
	this.playersInjured = new Array();	// an array of type Player; all broken players
	this.sub = sub;						// the method for player substitution
	this.requiresUpdate = false;		// if the main UI requires updating (i.e., player subbed)
	this.test2 = test2;
	
	// Set the first 7 players in play by default. This should be a stored lineup
	// or set by the user before the game.  Should also set injured players, if
	// there is any.
	var player;
	var numPlayers = 0;
	for (player in players) {
		if (numPlayers < MAX_INPLAY) {
			this.playersInPlay[numPlayers] = this.players[player];
		} else {
			this.playersBenched[numPlayers-MAX_INPLAY] = this.players[player];
		}
		numPlayers++;
	}
	
	if (this.playersInPlay < MAX_INPLAY) {
		// TODO: Not enough players to play the game.
	}
};

function sub(leavingPlayer,enteringPlayer) {
	var leavingIndex = findPlayerIndex(this.playersInPlay,leavingPlayer);
	var enteringIndex = findPlayerIndex(this.playersBenched,enteringPlayer);
	
	if (leavingIndex != -1) {
		if (enteringIndex != -1) {
			// get the player subbing in
			var playerToGame = this.playersBenched.splice(enteringIndex,1);
			// get the player subbing out, replacing the player with the sub
			var playerToBench = this.playersInPlay.splice(leavingIndex,1,playerToGame);
			// add player subbed out to the bench
			this.playersBenched[this.playersBenched.length] = playerToBench;
			console.log(playerToBench);
			console.log(this.playersBenched);
			
			/*
				The above code inserts the sub where the in game player was removed (the sub
				will take the player's place in the playerBar.  The following code will add
				the sub to the end of the playerBar (easier to track who has been in the game
				longer from a glance?).
			//
			// remove the player subbing out from the game, saving the player object
			var playerToBench = this.playersInPlay.splice(leavingIndex,1);
			// remove the player subbing in from the bench, saving the player object
			var playerToGame = this.playersBenched(enteringIndex,1);
			// add the benched player to the bench and the player subbed in to playersInPlay
			this.playersInPlay.push(playerToGame);
			this.playersBenched.push(playerToBench);
			*/
		} else {
			console.log('Team.sub() called, player entering the game not found.');	// TODO:
		}
	} else {
		console.log('Team.sub() called, player leaving the game not found.');	// TODO:
	}
};

// Returns the index of the player, or -1 if not found (indexOf didn't work for my player object)
function findPlayerIndex(playerArray,playerName) {
	for (var i=0;i<playerArray.length;i++) {
		if (playerArray[i].name == playerName) {
			return i;
		}
	}
	// we made it here, so we didn't find the player in the array
	return -1;
};

function test2() {
	console.log(this.playersBenched);
};