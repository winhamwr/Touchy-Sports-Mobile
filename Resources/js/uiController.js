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
	
	this.initSubDialog(ultimate_canvas);
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

WebUiController.prototype.subUpdated = function(ultimate_canvas) {
	ultimate_canvas.home_team.sub(this.subbingOut, this.subbingIn);
	ultimate_canvas.hideSub(true);
	subbingIn = null;
	subbingOut = null;
};

WebUiController.prototype.subCancelled = function(ultimate_canvas) {
	ultimate_canvas.hideSub(false);
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
					ultimate_canvas.home_team.sub(subbingOut, subbingIn);
					ultimate_canvas.hideSub(true);
					subbingIn = null;
					subbingOut = null;
					$(this).dialog("close");
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
						'<thead>Game Status</thead>'+
						'<tbody><tr>'+
							'<td><div id="giUserTeamName" class="giName"></div><div id="giUserTeamScore" class="giScore"></div></td></tr><tr>'+
							'<td><div id="giOppTeamName" class="giName"></div><div id="giOppTeamScore" class="giScore"></div></td></tr>'+
					'</tbody></table></div>')
		.dialog({
			autoOpen: false,
			modal: true,
			width: 300,
			height: 216,
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
					/* TODO: Implement this...
						ultimate_canvas.myFunction();
					*/
					$(this).dialog("close");
				},
				"Make Substitution": function() {
					/* TODO: Implement this...
						ultimate_canvas.myFunction();
					*/
					$(this).dialog("close");
				}
			}
		});

		// remove the titlebar
	this.$gameInfoDialog.dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
};

ui_controller = WebUiController;


























