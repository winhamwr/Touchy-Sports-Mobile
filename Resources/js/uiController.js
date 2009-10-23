if(!WebUiController) var WebUiController = {};

$.extend(WebUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init();
	}
});

WebUiController.ui.prototype.init = function() {
};

WebUiController.ui.prototype.draw = function(){
	this.drawField();
};

WebUiController.ui.prototype.drawField = function() {
	this.drawFieldRects();
	this.drawFieldHorizontalLines();
	this.drawFieldVerticalLines();
};

WebUiController.ui.prototype.drawFieldRects = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this._f.ez_w;
	var h = this._f.h;
	var inner_w = this._f.inner_w;

	// endzone rectangles
	context.fillStyle = "#003300";	// Dark Green
	context.strokeStyle = "#000000"; // Black Goal Lines
	context.fillRect(0, 0, ez_w, h);
	context.strokeRect(0, 0, ez_w, h);
	context.fillRect(
		ez_w + inner_w,
		0,
		ez_w,
		h);
	context.strokeRect(
		ez_w + inner_w,
		0,
		ez_w,
		h);

	// field rectangle
	context.fillStyle = "#336633"; // Green
	context.fillRect(ez_w, 0, inner_w, h)
	context.strokeRect(ez_w, 0, inner_w, h)
};

WebUiController.ui.prototype.drawFieldHorizontalLines = function() {
	var context = this._canvas.getContext("2d");

	var hash_h = this._f.hash_h;
	var w = this._f.w;

	context.strokeStyle = "#FFFFFF";
	context.beginPath();
	context.moveTo(0, hash_h);
	context.lineTo(w, hash_h);
	context.moveTo(0, hash_h*2);
	context.lineTo(w, hash_h*2);
	context.stroke();
};

WebUiController.ui.prototype.drawFieldVerticalLines = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this._f.ez_w;
	var h = this._f.h;
	var hash_w = this._f.hash_w;

	context.strokeStyle = "#FFFFFF";
	context.beginPath();

	context.moveTo(ez_w+hash_w, 0);
	context.lineTo(ez_w+hash_w, h);

	context.moveTo(ez_w+hash_w*2, 0);
	context.lineTo(ez_w+hash_w*2, h);

	context.moveTo(ez_w+hash_w*3, 0);
	context.lineTo(ez_w+hash_w*3, h);

	context.stroke();
};

WebUiController.ui.prototype.drawPass = function(from, to, last_pass) {
	if(from){
		// We have a source point, draw a line between the points
		var context = this._canvas.getContext("2d");

		context.strokeStyle = "#ffffff";	// White
		context.fillStyle = "#ffffff";	// White
		context.beginPath();
		context.moveTo(from.x,from.y);
		context.lineTo(to.x,to.y);
		context.stroke();
	}

	var point_color = "#003300"; // DARK GREEN
	if(last_pass){
		var point_color = '#ffffff'; //WHITE
	}
	this.drawPoint(to, point_color);
};

/**
 * Draws a single point on the field representing a pass.
 */
WebUiController.ui.prototype.drawPoint = function(point, color){
	var context = this._canvas.getContext("2d");

	if(color){
		context.strokeStyle = color;
		context.fillStyle = color;
	} else {
		context.strokeStyle = "#ffffff";	// White
		context.fillStyle = "#ffffff";	// White
	}


	// Draw a circle at the point
	context.beginPath();
	var radius         = 7;                    // Arc radius
	var startAngle     = 0;                     // Starting point on circle
	var endAngle       = Math.PI+(Math.PI*2)/2; // End point on circle

	context.arc(point.x, point.y, radius, startAngle, endAngle, false);
	context.fill();
	context.stroke();
};

WebUiController.ui.prototype.drawPasses = function(passes){
	var ui = this;

	if(passes.length == 0){
		return null;
	}
	var DRAW_COUNT = 3 // The number of passes to draw

	var index = -1 * DRAW_COUNT;
	var passes_to_draw = passes.slice(index);
	var from = null;
	$.each(passes_to_draw, function(i, to){
		var last_pass = false;
		if(i + 1 == passes_to_draw.length){
			last_pass = true;
		}
		ui.drawPass(from, to, last_pass);
		from = to;
	})
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
		context.strokeStyle = "#ffffff";	// WHITE
		context.fillStyle = "#ffffff";	// WHITE
	} else {
		// away score
		context.strokeStyle = "#ffffff";	// WHITE
		context.fillStyle = "#ffffff";	// WHITE
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