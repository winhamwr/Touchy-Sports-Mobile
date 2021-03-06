function WebUiController(canvas) {
	this.canvas = canvas;
}

mixin(WebUiController.prototype, uiControlling);

WebUiController.prototype.init = function() {
	this.WIDTH_OFFSET = 15;
	this.HEIGHT_OFFSET = -40;

	this.initField();
	//this.handleDialogCloseButton();
	this.dialogs = null;
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
		ultimate_canvas.handleSubDialogCancel();	// the user is finished marking substitutions
	});
	
	// init the dialogs
	this.dialogs = new UltimateDialogs(ultimate_canvas);
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
	this.dialogs.showSubDialog(home_team, playerLeavingName);
};

WebUiController.prototype.showGameInfoDialog = function(userTeamName, userTeamScore, oppTeamName, oppTeamScore) {
	this.dialogs.showGameInfoDialog(userTeamName, userTeamScore, oppTeamName, oppTeamScore);
};

WebUiController.prototype.showGameOpeningDialog = function(player_names) {
	this.dialogs.showGameOpeningDialog(player_names);
};

ui_controller = WebUiController;