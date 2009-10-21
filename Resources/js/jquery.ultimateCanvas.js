;(function($) {

if(!UltimateCanvas) var UltimateCanvas = {};

$.extend(UltimateCanvas, {
	/*
	 * Constant values
	 */
	HOME_TEAM		: 0,
	AWAY_TEAM		: 1,

	/*
	 * Canvas object constructor
	 */
	canvas	: function(elem, options) {
		this._elem = elem;
		this._canvas = elem[0];
		this._options = options;

		this.init();
	}
});

/*
 * Registers the jquery plugin function
 */
$.fn.ultimateCanvas = function(options) {

	defaults = {
		total_width			: 474,
		field_height		: 276,
		endzone_width		: 79,
		score_limit			: 7
	};

	options = $.extend(defaults, options);

	// Stuff that depends on options
	var field_width			= options.total_width - options.endzone_width * 2;
	var inner_field_width	= options.total_width - options.endzone_width * 2;
	var hash_height			= options.field_height / 3;
	var hash_width			= field_width / 4;

	options = $.extend(options,
		{
			field_width			: field_width,
			inner_field_width	: inner_field_width,
			hash_height			: hash_height,
			hash_width			: hash_width
		}, options);

	return this.each(function() {
		new UltimateCanvas.canvas($(this), options);
	});
};

UltimateCanvas.canvas.prototype.init = function() {
	this.ui_controller = new this._options.ui_controller(this._canvas, {});

	this.initGame();
	this.bindEvents();
};

UltimateCanvas.canvas.prototype.bindEvents = function() {
	var c = this;

	this._elem.click(function(event) {
		c.handleClick(event);
	});

	var player_bar = $('#player-bar');
	player_bar.click(c.handlePlayerClick);

};

UltimateCanvas.canvas.prototype.handleClick = function(event) {
	var c = this;

	c.clickCount++;
	var newClick = {
		"x":event.clientX,
		"y":event.clientY
	};
	c.clicks[c.clickCount-1] = newClick;

	if(c.passIsScore(newClick, c.possession)){
		return c.handleScore(c.possession);
	} else{
		c.draw();
		c.getPlayer();
	}
};

UltimateCanvas.canvas.prototype.initGame =	function() {
	this.clicks = [];
	this.clickCount = 0;
	this.possession = UltimateCanvas.HOME_TEAM;

	this.home_score = 0;
	this.away_score = 0;

	this.draw();
};

UltimateCanvas.canvas.prototype.initPoint = function() {
	this.clicks = [];
	this.clickCount = 0;

	this.draw();
};

UltimateCanvas.canvas.prototype.draw = function(){
	this.drawField();
	this.drawPasses();
	this.ui_controller.displayScore(UltimateCanvas.HOME_TEAM, this.home_score);
	this.ui_controller.displayScore(UltimateCanvas.AWAY_TEAM, this.away_score);
};


UltimateCanvas.canvas.prototype.setDirArrow = function() {
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#FF00FF";
	context.beginPath();
	// Draw the cross-field line
	var ez_w = this._options.endzone_width;
	var field_h = this._options.field_height;

	context.moveTo(2*ez_w, field_h/2);
	context.lineTo(4*ez_w, field_h/2);

	if(this.possession == UltimateCanvas.HOME_TEAM) {
		context.lineTo(4*ez_w - 30, field_h/2 - 30);
		context.moveTo(4*ez_w, field_h/2);
		context.lineTo(4*ez_w - 30, field_h/2 + 30);
	} else {
		context.moveTo(2*ez_w, field_h/2);
		context.lineTo(2*ez_w + 30, field_h/2 - 30);
		context.moveTo(2*ez_w, field_h/2);
		context.lineTo(2*ez_w + 30, field_h/2 + 30);
	}

	context.stroke();
};



UltimateCanvas.canvas.prototype.drawField = function() {
	this.drawFieldRects();
	this.drawFieldHorizontalLines();
	this.drawFieldVerticalLines();
	this.setDirArrow();
};

UltimateCanvas.canvas.prototype.drawFieldRects = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this._options.endzone_width;
	var field_h = this._options.field_height;
	var inner_f_w = this._options.inner_field_width;

	// endzone rectangles
	context.fillStyle = "#3300FF";	// blue 25,70,25
	context.strokeStyle = "#000000";
	context.fillRect(0, 0, ez_w, field_h);
	context.strokeRect(0, 0, ez_w, field_h);
	context.fillRect(
		ez_w + inner_f_w,
		0,
		ez_w,
		field_h);
	context.strokeRect(
		ez_w + inner_f_w,
		0,
		ez_w,
		field_h);

	// field rectangle
	context.fillStyle = "#33FF00"; // green
	context.fillRect(ez_w, 0, inner_f_w, field_h)
	context.strokeRect(ez_w, 0, inner_f_w, field_h)
};

UltimateCanvas.canvas.prototype.drawFieldHorizontalLines = function() {
	var context = this._canvas.getContext("2d");

	var hash_h = this._options.hash_height;
	var total_w = this._options.total_width;

	context.strokeStyle = "#FFFFFF";
	context.beginPath();
	context.moveTo(0, hash_h);
	context.lineTo(total_w, hash_h);
	context.moveTo(0, hash_h*2);
	context.lineTo(total_w, hash_h*2);
	context.stroke();
};

UltimateCanvas.canvas.prototype.drawFieldVerticalLines = function() {
	var context = this._canvas.getContext("2d");

	var ez_w = this._options.endzone_width;
	var field_h = this._options.field_height;
	var hash_w = this._options.hash_width;

	context.strokeStyle = "#FFFFFF";
	context.beginPath();

	context.moveTo(ez_w+hash_w, 0);
	context.lineTo(ez_w+hash_w, field_h);

	context.moveTo(ez_w+hash_w*2, 0);
	context.lineTo(ez_w+hash_w*2, field_h);

	context.moveTo(ez_w+hash_w*3, 0);
	context.lineTo(ez_w+hash_w*3, field_h);

	context.stroke();
};

UltimateCanvas.canvas.prototype.drawPass = function(from, to) {
	if(to == null){
		return null;
	}

	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#FFFF00";	// yellow
	context.fillStyle = "#FFFF00";	// yellow
	context.beginPath();
	context.moveTo(from.x,from.y);
	context.lineTo(to.x,to.y);
	context.stroke();

	this.drawPoint(to);
};

UltimateCanvas.canvas.prototype.drawPoint = function(point){
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#FFFF00";	// yellow
	context.fillStyle = "#FFFF00";	// yellow

	// Draw a circle at the point
	context.beginPath();
	var radius         = 7;                    // Arc radius
	var startAngle     = 0;                     // Starting point on circle
	var endAngle       = Math.PI+(Math.PI*2)/2; // End point on circle

	context.arc(point.x, point.y, radius, startAngle, endAngle, false);
	context.fill();
	context.stroke();
};

UltimateCanvas.canvas.prototype.drawPasses = function(){
	if(this.clickCount == 0){
		return null;
	}
	// Loop through the last 3 clicks and draw them
	for(i = 3; i >= 0; i--){ // Start 3 clicks ago
		if(this.clickCount - i >= 0){
			// We have a click
			var curClick = this.clicks[this.clickCount-i];
			if(this.clickCount - i - 1 >= 0){
				// There's a click before the curClick
				var prevClick = this.clicks[this.clickCount-i-1];
				this.drawPass(prevClick, curClick);
			}else{
				// This is the last/only click
				this.drawPoint(curClick);
			}
		}
	}
};

UltimateCanvas.canvas.prototype.getPlayer = function() {
	$('#player-bar > div > div').removeClass('inactive');
	$('#player-bar > div > div').addClass('active');
};

UltimateCanvas.canvas.prototype.handlePlayerClick = function(event) {
	$('#player-bar > div > div').removeClass('active');
	$('#player-bar > div > div').addClass('inactive');
};


/**
 * Determine if a pass click is a score.
 */
UltimateCanvas.canvas.prototype.passIsScore = function(click, possession){
	if(possession == UltimateCanvas.HOME_TEAM){
		if(click.x >= this._options.endzone_width + this._options.inner_field_width){
			return true;
		}
	}else{
		if(click.x <= this._options.endzone_width){
			return true;
		}
	}

	return false;
};

UltimateCanvas.canvas.prototype.handleScore = function(possession){
	if(possession == UltimateCanvas.HOME_TEAM){
		this.home_score++;
		this.possession = UltimateCanvas.AWAY_TEAM;
		var score = this.home_score;
	}else{
		this.away_score++;
		this.possession = UltimateCanvas.HOME_TEAM;
		var score = this.away_score;
	}
	// UiController
	this.ui_controller.alert("omg. You scored!. You've got "+score+" points!");
	if(score >= self._options.score_limit){
		this.ui_controller.alert("Whoa. You totally scored enough points to make you the winner!");
		return this.initGame();
	}

	this.initPoint()
};

})(jQuery);

