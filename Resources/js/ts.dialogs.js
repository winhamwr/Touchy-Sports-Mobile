UltimateDialogs = function(ultimate_canvas) {
	// See: http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");
	   
	 this.init(ultimate_canvas);
};

UltimateDialogs.prototype.init = function(ultimate_canvas) {
	/* substitution dialog stuff */
	this.$subDialog = null;
	this.subbingIn = null;
	this.subbingOut = null;
	this.lastClicked = null;
	this.initSubDialog(ultimate_canvas);
	
	/* game info dialog stuff */
	this.$gameInfoDialog = null;
	this.initGameInfoDialog(ultimate_canvas);
};

/**
 * Creates and initializes the Substitution dialog.
 *
 * TODO: This should probably take in the functions to call when the buttons are pressed,
 *				 rather than assuming we know everything about the caller (ultimate_canvas).
 */
UltimateDialogs.prototype.initSubDialog = function(ultimate_canvas) {
	var d = this;
	
	this.$subDialog = $('<div></div>')
		.html('<div class="playerTable">'+
					'<table align="center" id="benchedPlayers">'+
						'<thead></thead>'+
						'<tbody></tbody>'+
				'</table></div>')
		.dialog({
			autoOpen: false,
			modal: true,
			width: 370,
			height: 316,
			show: 'drop',
			closeOnEscape: false,
			draggable: false,
			resizable: false,
			overlay: {
				backgroundColor: '#000',
				opacity: .5
			},
			buttons: {
				"Sub": function() {
					if (d.subbingIn == null) {
						alert("Choose a player first, or click Cancel if you're finished subbing.");	// user didn't select a sub
					} else {
						ultimate_canvas.makeSubstitution(d.subbingOut, d.subbingIn);
						d.subbingIn = null;
						d.subbingOut = null;
						d.lastClicked = null;
						$(this).dialog("close");
					}
				},
				"Cancel": function() {
					ultimate_canvas.handleSubDialogCancel();
					$(this).dialog("close");
				}
			}
		});

	// remove the titlebar
	this.$subDialog.dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
};

/**
 * Shows the substitution dialog.
 */
UltimateDialogs.prototype.showSubDialog = function(home_team, playerLeavingName) {
	var d = this;
	
	// store the player leaving and set the header
	d.subbingOut = playerLeavingName;
	$(this.$subDialog.find("thead")).html("<tr><th colspan=2>Who\'s going in for "+d.subbingOut+"?</th></tr>");
	
	// get the list of benched players and add them to the table
	var playersBenched = new Array();
	playersBenched = home_team.getBenchedPlayers();
	var playersList = '';
	for (a=0;a<playersBenched.length;a++) {
		playersList+='<tr><td class="playerName normal">'+playersBenched[a].name+'</td></tr>';
	}
	$(this.$subDialog.find("tbody")).html(playersList);

	// add the click event for the players
	$(this.$subDialog.find("td")).click(function() {
		if (d.lastClicked != null) {
			$(d.lastClicked).removeClass("highlighted");
			$(d.lastClicked).addClass("normal");
		}
		$(this).removeClass("normal");
		$(this).addClass("highlighted");
		d.lastClicked = $(this);
		d.subbingIn = $(this).text();
	});
	
	// show the dialog
	this.$subDialog.dialog('open');
};


/**
 * Creates and initializes the Game Info dialog.
 *
 * TODO: This should probably take in the functions to call when the buttons are pressed,
 *				 rather than assuming we know everything about the caller (ultimate_canvas).
 */
UltimateDialogs.prototype.initGameInfoDialog = function(ultimate_canvas) {
	this.$gameInfoDialog = $('<div></div>')
		.html('<div id="gameInfoBox">'+
					'<table align="center">'+
						'<thead></thead>'+
						'<tbody></tbody></table></div>')
		.dialog({
			autoOpen: false,
			modal: true,
			width: 292,
			height: 226,
			show: 'drop',
			closeOnEscape: false,
			draggable: false,
			resizable: false,
			overlay: {
				backgroundColor: '#000',
				opacity: .5
			},
			buttons: {
				"Play Point": function() {
					ultimate_canvas.playPoint();
					$(this).dialog("close");
				},
				"Make Substitution": function() {
					ultimate_canvas.startSubbing();
					$(this).dialog("close");
				}
			}
		});

		// remove the titlebar
	this.$gameInfoDialog.dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
};

/**
 * Shows the Game Info dialog.  This one is called after each point is scored.
 */
UltimateDialogs.prototype.showGameInfoDialog = function(userTeamName, userTeamScore, oppTeamName, oppTeamScore) {
	// build the info for the dialog
	var gameInfo = '';
	gameInfo+='<tr><td><div id="giUserTeamName" class="giName">' + userTeamName + '</div>';	// add the user team name
	gameInfo+='<div id="giUserTeamScore" class="giScore">' + userTeamScore + '</div></td></tr>';	// add the user team score
	gameInfo+='<tr><td><div id="giOppTeamName" class="giName">' + oppTeamName + '</div>';	// add the opposing team name
	gameInfo+='<div id="giOppTeamScore" class="giScore">' + oppTeamScore + '</div></td></tr>';	// add the opposing team score
	// set the info to be displayed in the dialog
	$(this.$gameInfoDialog.find('thead')).html('Scoreboard');
	$(this.$gameInfoDialog.find('tbody')).html(gameInfo);
	
	// show the dialog
	this.$gameInfoDialog.dialog('open');
};

/**
 * Shows the Game Info dialog.  This one is called before the start of each game.
 *
 * player_names	::	An array of strings containing the names of players that are currently going to be starting in play this game.
 */
UltimateDialogs.prototype.showGameOpeningDialog = function(player_names) {
	// build the info for the dialog
	var gameInfo = '';
	gameInfo+='<tr><td><div id="goPlayersList">';//Starting players:  ';
	gameInfo+=player_names.join(', ');
	gameInfo+='</div></td></tr>';
	
	// set the info to be displayed in the dialog
	$(this.$gameInfoDialog.find('thead')).html('Starting Players');
	$(this.$gameInfoDialog.find('tbody')).html(gameInfo);
	
	// show the dialog
	this.$gameInfoDialog.dialog('open');
};