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
 */
WebUiController.ui.prototype.displayScore = function(team, score) {
	var context = this._canvas.getContext("2d");
	context.font = "bold 12px sans-serif";

	context.strokeStyle = "#FFFF00";	// yellow

	if(context.fillText != null){
		if(team == 0){
			// Home score
			context.fillText(
				score,
				40,
				135);
		} else {
			// Away score
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

ui_controller = WebUiController.ui;