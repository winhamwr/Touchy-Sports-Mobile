if(!WebUiController) var WebUiController = {};

$.extend(WebUiController, {

	ui	: function(canvas, options) {
		this._options = options;
		this._canvas = canvas;

		this.init();
	}
});

WebUiController.ui.prototype.init = function() {
};

/*
 * Pops up an alert/message box displaying the given message.
 */
WebUiController.ui.prototype.alert = function(msg) {
	alert(msg);
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
WebUiController.ui.prototype.displayScore = function(team, ez, score) {
	var context = this._canvas.getContext("2d");
	context.font = "bold 12px sans-serif";

	if(team == 0){
		// home score
		context.strokeStyle = "#FFFF00";	// yellow
		context.fillStyle = "#FFFF00";	// yellow
	} else {
		// away score
		context.strokeStyle = "#00FF00";	// blue
		context.fillStyle = "#00FF00";	// blue
	}

	if(context.fillText != null){
		if(ez == 0){
			// Left side score
			context.fillText(
				score,
				40,
				135);
		} else {
			// Right side score
			context.fillText(
				score,
				440,
				135);
		}
	} else {
		if(DEBUG == true){
			this.alert("Your device does not support text on canvas");
		}
	}
};

/*
 * Display the undo button.
 */
WebUiController.ui.prototype.showUndoButton = function() {
	$('#undo_b').show();
};

/*
 * Hide the undo button.
 */
WebUiController.ui.prototype.hideUndoButton = function() {
	$('#undo_b').hide();
};

/*
 * Display the turnover button.
 */
WebUiController.ui.prototype.showTurnoverButton = function() {
	$('#turnover_b').show();
};

/*
 * Hide the turnover button.
 */
WebUiController.ui.prototype.hideTurnoverButton = function() {
	$('#turnover_b').hide();
};

/*
 * Display the player buttons.
 */
WebUiController.ui.prototype.showPlayerButtons = function() {
	$('#player-bar').show();
};

/*
 * Hide the player button.
 */
WebUiController.ui.prototype.hidePlayerButtons = function() {
	$('#player-bar').hide();
};

ui_controller = WebUiController.ui;