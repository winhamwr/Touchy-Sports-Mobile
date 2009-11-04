if(!AndroidUiController) var AndroidUiController = {};

$.extend(AndroidUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init();
                this.bindEvents();
	}
});

AndroidUiController.ui.prototype = new BaseUiController.ui();
AndroidUiController.ui.prototype.contructor = new AndroidUiController.ui();

/*
 * Pops up an alert/message box displaying the given message.
 */
AndroidUiController.ui.prototype.alert = function(msg) {
        var myalert = Titanium.UI.createAlertDialog();
        myalert.setMessage(msg);
        myalert.setButtonNames(['OK']);
        myalert.show();
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
AndroidUiController.ui.prototype.displayScore = function(team, ez, score) {
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

/**
 * Bind the event listeners on the UI controls
 */
AndroidUiController.ui.prototype.bindEvents = function() {
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

AndroidUiController.ui.prototype.init = function() {
    $('#player-bar > div > div').append('<button>Fred Sanford</button>');

    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
	$('#sub_b').append('<button onClick="showSub()">Sub</button>');
};

ui_controller = AndroidUiController.ui;