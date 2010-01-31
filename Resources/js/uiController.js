var subLastClicked = null;
var subbingOut = null;
var subbingIn = null;

function WebUiController(canvas) {
	this.canvas = canvas;
}

mixin(WebUiController.prototype, uiControlling);

WebUiController.prototype.init = function() {
	this.WIDTH_OFFSET = 15;
	this.HEIGHT_OFFSET = -40;

	this.initField();
	
	/* substitution dialog stuff */
	this.$subDialog = null;
	this.subbingIn = null;
	this.subbingOut = null;
	this.hideSubButton();
	
	/* game info dialog stuff */
	this.$gameInfoDialog = null;
};

WebUiController.prototype.bindEvents = function(ultimate_canvas) {
	ultimate_canvas.canvas.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	for (var i=1;i<8;i++) {
		var playerButton = $('#player-button-'+i);
		playerButton.click(function() {
			ultimate_canvas.handlePlayerClick($(this).text());
		});
	}

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		ultimate_canvas.handleTurnover();
	});

	var undo_b = $('#undo_b')
	undo_b.click(function(event) {
		ultimate_canvas.handleUndo();
	});

	var sub_b = $('#sub_b')
	sub_b.click(function(event) {
		ultimate_canvas.hideSub(false);	// the user is finished marking substitutions
	});
	
	/* TODO: Move to dialog class */
	this.initSubDialog(ultimate_canvas);
	this.initGameInfoDialog(ultimate_canvas);
}

/*
 * Pops up an alert/message box displaying the given message.
 */
WebUiController.prototype.alert = function(msg) {
	alert(msg);
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
WebUiController.prototype.displayScore = function(team, ez, score) {
	var context = this.canvas[0].getContext("2d");
	context.font = "bold 20px sans-serif";

	if(team == 0){
		// home score
		context.strokeStyle = "#9F4848";	// WHITE
		context.fillStyle = "#9F4848";	// WHITE
	} else {
		// away score
		context.strokeStyle = "#269926";	// WHITE
		context.fillStyle = "#269926";	// WHITE
	}

	if(context.fillText != null){
		if(ez == 0){
			// Left side score
			context.fillText(
				score,
				this.field.ez_w/2,
				this.field.h/2 - 5);
		} else {
			// Right side score
			context.fillText(
				score,
				this.field.w - this.field.ez_w/2,
				this.field.h/2 - 5);
		}
	} else {
		if(DEBUG == true){
			this.alert("Your device does not support text on canvas");
		}
	}
};

WebUiController.prototype.showSubDialog = function(home_team, playerLeavingName) {
	// store the player leaving and set the header
	subbingOut = playerLeavingName;
	$(this.$subDialog.find("thead")).html("<tr><th colspan=2>Who\'s going in for "+subbingOut+"?</th></tr>");
	
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
		if (subLastClicked != null) {
			$(subLastClicked).removeClass("highlighted");
			$(subLastClicked).addClass("normal");
		}
		$(this).removeClass("normal");
		$(this).addClass("highlighted");
		subLastClicked = $(this);
		subbingIn = $(this).text();
	});
	
	// show the dialog
	this.$subDialog.dialog('open');
};

WebUiController.prototype.initSubDialog = function(ultimate_canvas) {
	this.$subDialog = $('<div></div>')
		.html('<div class="playerTable">'+
					'<table align="center" id="benchedPlayers">'+
						'<thead></thead>'+
						'<tbody></tbody>'+
				'</table></div>')
		.dialog({
			autoOpen: false,
			modal: true,
			width: 380,
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
					if (subbingIn == null) {
						alert('Please select a player from the bench, or click Cancel.');
					} else {
						ultimate_canvas.home_team.sub(subbingOut, subbingIn);
						ultimate_canvas.hideSub(true);
						subbingIn = null;
						subbingOut = null;
						$(this).dialog("close");
					}
				},
				"Cancel": function() {
					ultimate_canvas.hideSub(false);
					$(this).dialog("close");
				}
			}
		});

		// remove the titlebar
	this.$subDialog.dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
};

WebUiController.prototype.initGameInfoDialog = function(ultimate_canvas) {
	/* TODO: are the div tags needed or can we just use the td?  Would be cleaner... */
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
					ultimate_canvas.hideSub(false);
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

WebUiController.prototype.showGameInfoDialog = function(userTeamName, userTeamScore, oppTeamName, oppTeamScore) {
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

/* playersInPlayListAsString - a comma separated string containing the list of players to start the game */
WebUiController.prototype.showGameOpeningDialog = function(player_names) {
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

ui_controller = WebUiController;