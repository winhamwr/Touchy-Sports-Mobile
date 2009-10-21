;(function($) {

if(!UltimateCanvas) var UltimateCanvas = {};

$.extend(UltimateCanvas, {
	/*
	 * Constant values
	 */
	HOME_TEAM		: 0,
	AWAY_TEAM		: 1,
	LEFT_EZ			: 0,
	RIGHT_EZ		: 1,

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
	this.ui = new this._options.ui_controller(this._canvas, {});

	this.bindEvents();

	this.initGame();
};

/**
 * Bind the event listeners on the UI controls
 */
UltimateCanvas.canvas.prototype.bindEvents = function() {
	var c = this;

	this._elem.click(function(event) {
		c.handleClick(event);
	});

	var player_bar = $('#player-bar');
	player_bar.click(function(event) {
		c.handlePlayerClick(event);
	});

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		c.handleTurnover();
	});

};

UltimateCanvas.canvas.prototype.initGame =	function() {
	this.possession = UltimateCanvas.HOME_TEAM;
	this.home_endzone = UltimateCanvas.LEFT_EZ;
	this.away_endzone = UltimateCanvas.RIGHT_EZ;

	this.home_score = 0;
	this.away_score = 0;

	this.initPoint();
};

UltimateCanvas.canvas.prototype.initPoint = function() {
	this.clicks = [];
	this.clickCount = 0;
	this.can_click = true;
	this.scoring_pass = false;

	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();

	this.draw();
};

//
// EVENT HANDLERS
//

/**
 * Handle a field click to indicate a pass.
 */
UltimateCanvas.canvas.prototype.handleClick = function(event) {
	var c = this;

	// If clicking is disabled, don't do anything
	if(this.can_click == false){
		this.ui_controller.alert("Whoa! Hold your horses. Who caught that last pass?");
		return
	}

	c.can_click = false; // No more clicks until we select the player

	c.clickCount++;
	var newClick = {
		"x":event.clientX,
		"y":event.clientY
	};
	c.clicks[c.clickCount-1] = newClick;

	if(c.passIsInEz(newClick, c.possession)){
		c.handleEzCatch();
	}

	c.getPlayer();
	c.draw();

};

UltimateCanvas.canvas.prototype.handleTurnover = function(event) {
	var c = this;

	function switchPos(possession){
		if(possession == UltimateCanvas.AWAY_TEAM){
			possession = UltimateCanvas.HOME_TEAM;
		} else {
			possession = UltimateCanvas.AWAY_TEAM;
		}
		return possession
	}
	c.possession = switchPos(c.possession);

	c.ui.hideTurnoverButton();
	c.ui.hidePlayerButtons();

	var last_point = this.clicks.pop()
	this.clicks = [last_point]
	this.clickCount = 1;
	this.can_click = true;

	this.draw();
};

UltimateCanvas.canvas.prototype.handlePlayerClick = function(event) {
	$('#player-bar > div > div').removeClass('active');
	$('#player-bar > div > div').addClass('inactive');

	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();

	if(this.scoring_pass){
		this.endPoint(this.possession);
	} else{
		// Now that we've selected a player, we can handle field clicks again
		this.can_click = true;
	}
};

//
// DRAWING FUNCTION TO BE MOVED TO UI
//

UltimateCanvas.canvas.prototype.draw = function(){
	this.drawField();
	this.drawPasses();
	this.ui.displayScore(UltimateCanvas.HOME_TEAM, this.home_endzone, this.home_score);
	this.ui.displayScore(UltimateCanvas.AWAY_TEAM, this.away_endzone, this.away_score);
};


UltimateCanvas.canvas.prototype.setDirArrow = function() {
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#000000";
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
	context.fillStyle = "#003300";	// Dark Green
	context.strokeStyle = "#000000"; // Black Goal Lines
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
	context.fillStyle = "#336633"; // Green
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

	context.strokeStyle = "#ffffff";	// White
	context.fillStyle = "#ffffff";	// White
	context.beginPath();
	context.moveTo(from.x,from.y);
	context.lineTo(to.x,to.y);
	context.stroke();

	this.drawPoint(to);
};

UltimateCanvas.canvas.prototype.drawPoint = function(point){
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#ffffff";	// White
	context.fillStyle = "#ffffff";	// White

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

	this.ui.showTurnoverButton();
	this.ui.showPlayerButtons();
};



/**
 * Determine if a pass click is in the endzone.
 */
UltimateCanvas.canvas.prototype.passIsInEz = function(click, possession){
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

/**
 * Called when a catch was in the endzone.
 */
UltimateCanvas.canvas.prototype.handleEzCatch = function(){
	// This was a scoring pass.
	// We want to end the point after the user picks the catcher
	this.scoring_pass = true;
};

/**
 * Called after the person who caught the point is selected. Wraps up the point
 * and either starts another or ends the game.
 */
UltimateCanvas.canvas.prototype.endPoint = function(possession){
	if(possession == UltimateCanvas.HOME_TEAM){
		this.home_score++;
		this.possession = UltimateCanvas.AWAY_TEAM;
		var score = this.home_score;
	}else{
		this.away_score++;
		this.possession = UltimateCanvas.HOME_TEAM;
		var score = this.away_score;
	}
	//Switch endzones
	var a_ez = this.away_endzone;
	this.away_endzone = this.home_endzone;
	this.home_endzone = a_ez;

	// UiController
	this.ui.alert("omg. You scored!. You've got "+score+" points!");
	if(score >= this._options.score_limit){
		this.ui.alert("Whoa. You totally scored enough points to make you the winner!");
		this.initGame();
	} else {
		this.initPoint();
	}
};

})(jQuery);

