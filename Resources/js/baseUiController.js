if(!BaseUiController) var BaseUiController = {};

$.extend(BaseUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init();
	}
});

BaseUiController.ui.prototype.init = function() {
};

BaseUiController.ui.prototype.bindEvents = function() {
	alert("BaseUiController.ui.prototype.bindEvents NOT IMPLEMENTED");
}

BaseUiController.ui.prototype.draw = function(){
	this.drawField();
};

BaseUiController.ui.prototype.drawField = function() {
	this.drawFieldRects();
	this.drawFieldHorizontalLines();
	this.drawFieldVerticalLines();
};

BaseUiController.ui.prototype.drawFieldRects = function() {
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

BaseUiController.ui.prototype.drawFieldHorizontalLines = function() {
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

BaseUiController.ui.prototype.drawFieldVerticalLines = function() {
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

BaseUiController.ui.prototype.drawPass = function(from, to, last_pass) {
	if(from){
		// We have a source point, draw a line between the points
		var context = this._canvas.getContext("2d");

		context.strokeStyle = "#003300";	// DARK GREEN
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
BaseUiController.ui.prototype.drawPoint = function(point, color){
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

BaseUiController.ui.prototype.drawPasses = function(passes){
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
BaseUiController.ui.prototype.alert = function(msg) {
	alert("BaseUiController.ui.prototype.alert NOT IMPLEMENTED");
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
BaseUiController.ui.prototype.displayScore = function(team, ez, score) {
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
 * Display the possession indicator on the field, which lets the user know which
 * team has the ball and in what direction they're going.
 */
BaseUiController.ui.prototype.displayPossessionIndicator = function(direction) {
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.beginPath();
	// Draw the cross-field line
	var ez_w = this._f.ez_w;
	var field_h = this._f.h;

	context.moveTo(2*ez_w, field_h/2);
	context.lineTo(4*ez_w, field_h/2);

	if(direction == 'right'){
		// Point Right
		context.lineTo(4*ez_w - 30, field_h/2 - 30);
		context.moveTo(4*ez_w, field_h/2);
		context.lineTo(4*ez_w - 30, field_h/2 + 30);
	} else {
		// Point Left
		context.moveTo(2*ez_w, field_h/2);
		context.lineTo(2*ez_w + 30, field_h/2 - 30);
		context.moveTo(2*ez_w, field_h/2);
		context.lineTo(2*ez_w + 30, field_h/2 + 30);
	}

	context.stroke();
};

/*
 * Display the undo button.
 */
BaseUiController.ui.prototype.showUndoButton = function() {
	$('#undo_b').show();
};

/*
 * Hide the undo button.
 */
BaseUiController.ui.prototype.hideUndoButton = function() {
	$('#undo_b').hide();
};

/*
 * Display the turnover button.
 */
BaseUiController.ui.prototype.showTurnoverButton = function() {
	$('#turnover_b').show();
};

/*
 * Hide the turnover button.
 */
BaseUiController.ui.prototype.hideTurnoverButton = function() {
	$('#turnover_b').hide();
};

/*
 * Display the player buttons.
 */
BaseUiController.ui.prototype.showPlayerButtons = function() {
	$('#player-bar').show();
};

/*
 * Hide the player button.
 */
BaseUiController.ui.prototype.hidePlayerButtons = function() {
	$('#player-bar').hide();
};