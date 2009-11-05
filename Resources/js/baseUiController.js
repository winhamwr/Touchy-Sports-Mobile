function BaseUiController(canvas) {
	this._canvas = canvas;
};

BaseUiController.prototype.init = function() {
	this.field = this.generateField();
};

/**
 * Determine the field size parameters.
 */
BaseUiController.prototype.generateField = function() {
	var total_width = $(window).width();
	var total_height = $(window).height();
	var endzone_width = 80;

	// Stuff that depends on options
	var inner_field_width	= total_width - endzone_width * 2;
	var hash_height			= total_height / 3;
	var hash_width			= inner_field_width / 4;

	var f = {
		w		:	total_width, //Total field width
		h		:	total_height, //Total field height
		inner_w	:	inner_field_width, //Field width not counting endzones
		ez_w	:	endzone_width, // Width of an endzone
		hash_w	:	hash_width, // Spacing of vertical hashes on the inner field
		hash_h	:	hash_height // Spacing of horizontal hashes on the field
	}

	return f;
};

/**
 * Resize the field based on the current screen size.
 */
BaseUiController.prototype.resizeField = function() {
	$('#field').attr('height', $(window).height()-HEIGHT_OFFSET);
	$('#field').attr('width', $(window).width()-WIDTH_OFFSET);
}

BaseUiController.prototype.bindEvents = function() {
	alert("BaseUiController.ui.prototype.bindEvents NOT IMPLEMENTED");
};

BaseUiController.prototype.setPlayerBarNames = function() {
	alert("BaseUiController.ui.prototype.setPlayerBarNames NOT IMPLEMENTED");
};

BaseUiController.prototype.draw = function(){
	this.drawField();
};

BaseUiController.prototype.drawField = function() {
	this.drawFieldRects();
	this.drawFieldHorizontalLines();
	this.drawFieldVerticalLines();
};

BaseUiController.prototype.drawFieldRects = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this.field.ez_w;
	var h = this.field.h;
	var inner_w = this.field.inner_w;

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

BaseUiController.prototype.drawFieldHorizontalLines = function() {
	var context = this._canvas.getContext("2d");

	var hash_h = this.field.hash_h;
	var w = this.field.w;

	context.strokeStyle = "#FFFFFF";
	context.beginPath();
	context.moveTo(0, hash_h);
	context.lineTo(w, hash_h);
	context.moveTo(0, hash_h*2);
	context.lineTo(w, hash_h*2);
	context.stroke();
};

BaseUiController.prototype.drawFieldVerticalLines = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this.field.ez_w;
	var h = this.field.h;
	var hash_w = this.field.hash_w;

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

BaseUiController.prototype.drawPass = function(from, to, last_pass) {
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
BaseUiController.prototype.drawPoint = function(point, color){
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

BaseUiController.prototype.drawPasses = function(passes){
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
BaseUiController.prototype.alert = function(msg) {
	alert("BaseUiController.ui.prototype.alert NOT IMPLEMENTED");
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
BaseUiController.prototype.displayScore = function(team, ez, score) {
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
BaseUiController.prototype.displayPossessionIndicator = function(direction) {
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.beginPath();
	// Draw the cross-field line
	var ez_w = this.field.ez_w;
	var field_h = this.field.h;

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
BaseUiController.prototype.showUndoButton = function() {
	$('#undo_b').show();
};

/*
 * Hide the undo button.
 */
BaseUiController.prototype.hideUndoButton = function() {
	$('#undo_b').hide();
};

/*
 * Display the turnover button.
 */
BaseUiController.prototype.showTurnoverButton = function() {
	$('#turnover_b').show();
};

/*
 * Hide the turnover button.
 */
BaseUiController.prototype.hideTurnoverButton = function() {
	$('#turnover_b').hide();
};

/*
 * Display the player buttons.
 */
BaseUiController.prototype.showPlayerButtons = function() {
	$('#player-bar').show();
};

/*
 * Hide the player button.
 */
BaseUiController.prototype.hidePlayerButtons = function() {
	$('#player-bar').hide();
};