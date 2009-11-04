if(!WebUiController) var WebUiController = {};

$.extend(WebUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init();
                this.bindEvents();
	}
});

WebUiController.ui.prototype = new BaseUiController.ui();
WebUiController.ui.prototype.contructor = new WebUiController.ui();

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

WebUiController.ui.prototype.init = function() {
    $('#player-bar > div > div').append('<button>Fred Sanford</button>');

    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
	$('#sub_b').append('<button onClick="showSub()">Sub</button>');
};

/**
 * Bind the event listeners on the UI controls
 */
WebUiController.ui.prototype.bindEvents = function() {
	var c = this;

	this._elem.click(function(event) {
                c.handlePass(event);
	});

	var player_bar = $('#player-bar');
	player_bar.click(function(event) {
		c.handlePlayerClick(event);
	});

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		c.handleTurnover();
	});

	var undo_b = $('#undo_b')
	undo_b.click(function(event) {
		c.handleUndo();
	});
};


ui_controller = WebUiController.ui;