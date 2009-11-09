function WebUiController(canvas) {
	this.canvas = canvas;
}

mixin(WebUiController.prototype, uiControlling);

WebUiController.prototype.init = function() {
	this.WIDTH_OFFSET = -15;
	this.HEIGHT_OFFSET = -50;
	// Initialize the field
	this.initField();

    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
	$('#sub_b').append('<button>Sub</button>');
};

WebUiController.prototype.setPlayerBarNames = function() {
	if (homeTeam == 'undefined' || homeTeam == null) {
		alert('Unable to get player names from homeTeam in ui.setPlayerBarNames');
	} else {
		console.log(homeTeam, '\n\n', homeTeam.playersInPlay);
		var playerCount = homeTeam.playersInPlay.length;
		if (playerCount < ultimateTeam.MAX_INPLAY) {
			alert('Not enough players to play the game!');
		} else {
			for (var i=0;i<playerCount;i++) {
				$playerBarButton = $('#player-button-'+(i+1));
				$playerBarButton.html('<button>'+homeTeam.playersInPlay[i].nickname+'</button>');
			}
		}
	}
};

WebUiController.prototype.bindEvents = function(ultimate_canvas) {
	ultimate_canvas._elem.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	for (var i=1;i<8;i++) {
		var playerButton = $('#player-button-'+i);
		playerButton.click(function() {
			ultimate_canvas.handlePlayerClick($(this));
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
		ultimate_canvas.handleSub();
	});
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
	var context = this.canvas.getContext("2d");
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




ui_controller = WebUiController;