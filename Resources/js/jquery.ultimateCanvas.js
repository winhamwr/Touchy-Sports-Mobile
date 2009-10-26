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
	field = {
		w		: this._options.total_width, //Total field width
		h		: this._options.field_height, //Total field height
		inner_w	: this._options.inner_field_width, //Field width not counting endzones
		ez_w	: this._options.endzone_width, // Width of an endzone
		hash_w	: this._options.hash_width, // Spacing of vertical hashes on the inner field
		hash_h	: this._options.hash_height // Spacing of horizontal hashes on the field
	};
	this.ui = new this._options.ui_controller(this._canvas, field, {});

	this.bindEvents();

	this.initGame();
};

/**
 * Bind the event listeners on the UI controls
 */
UltimateCanvas.canvas.prototype.bindEvents = function() {
	var c = this;
        
	this._elem.click(function(event) {
            if(c.chooseAwayPlayer==0){
                if(c.possession==UltimateCanvas.HOME_TEAM){
                    c.handlePass(event);
                } else{
                    c.handleAwayPass(event);
                }
            } else{
                c.handlePass(event);
            }
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

UltimateCanvas.canvas.prototype.initGame =	function() {
	this.possession = UltimateCanvas.HOME_TEAM;
	this.home_endzone = UltimateCanvas.LEFT_EZ;
	this.away_endzone = UltimateCanvas.RIGHT_EZ;

	this.home_score = 0;
	this.away_score = 0;

        // Setting used to determine whether or not to choose players for away team, 0=don't choose player, 1=choose player
        this.chooseAwayPlayer = 0;

	this.initPoint();
};

UltimateCanvas.canvas.prototype.initPoint = function() {
	this.passes = [];
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
UltimateCanvas.canvas.prototype.handlePass = function(event) {
	var c = this;

	// If clicking is disabled, don't do anything
	if(c.can_click == false){
		this.ui.alert("Whoa! Hold your horses. Who caught that last pass?");
		return
	}

	c.can_click = false; // No more clicks until we select the player

	var new_pass = {
		"x":event.clientX,
		"y":event.clientY
	};
	c.passes.push(new_pass);

	if(c.passIsInEz(new_pass, c.possession)){
		c.handleEzCatch();
	}

	c.getPlayer();
	c.draw();

};

/**
 * Handle a field click for the away team if user doesn't want to choose a player to indicate a pass.
 */
UltimateCanvas.canvas.prototype.handleAwayPass = function(event) {
	var c = this;

	var new_pass = {
		"x":event.clientX,
		"y":event.clientY
	};
	c.passes.push(new_pass);

	if(c.passIsInEz(new_pass, c.possession)){
		c.handleEzCatch();
	}

        c.draw();

	if(this.scoring_pass){
		this.endPoint(this.possession);
	}
 
        c.ui.showTurnoverButton();
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

	var last_point = this.passes.pop()
	this.passes = [last_point]
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

UltimateCanvas.canvas.prototype.handleUndo = function(event) {
	if(this.can_click){
		this.ui.alert("Nyerk. Can't do that yet. Quit messing up maybe?");
		//Undo a player choice
		//Don't have anything to do right now, cause we don't actually record players

		//Need to undo the last score
	} else{
		//Undo a pass
		this.passes.pop();
		this.handlePlayerClick(); //Works just like they selected a player
		this.draw();
	}
};

//
// DRAWING
//

UltimateCanvas.canvas.prototype.draw = function(){
	this.ui.draw();
	this.setDirArrow();
	this.drawPasses();
	this.ui.displayScore(UltimateCanvas.HOME_TEAM, this.home_endzone, this.home_score);
	this.ui.displayScore(UltimateCanvas.AWAY_TEAM, this.away_endzone, this.away_score);
};


//TODO: Move this to uiController.js
UltimateCanvas.canvas.prototype.setDirArrow = function() {
	var context = this._canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.beginPath();
	// Draw the cross-field line
	var ez_w = this._options.endzone_width;
	var field_h = this._options.field_height;

	context.moveTo(2*ez_w, field_h/2);
	context.lineTo(4*ez_w, field_h/2);

	var attackersEndzone = this.getAttackersEndzone();

	if(attackersEndzone == UltimateCanvas.LEFT_EZ){
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

UltimateCanvas.canvas.prototype.drawPasses = function(){
	this.ui.drawPasses(this.passes);
}


UltimateCanvas.canvas.prototype.getPlayer = function() {
	$('#player-bar > div > div').removeClass('inactive');
	$('#player-bar > div > div').addClass('active');

	this.ui.showTurnoverButton();
	this.ui.showPlayerButtons();
};

/**
 * Determine the attackers endzone
 */
UltimateCanvas.canvas.prototype.getAttackersEndzone = function(){
	if(this.possession == UltimateCanvas.HOME_TEAM){
		//Home team has possession
		var attackersEndzone = this.home_endzone;
	} else{
		//Away team has possession
		var attackersEndzone = this.away_endzone;
	}
	return attackersEndzone;
};


/**
 * Determine if a pass click is in the endzone.
 */
UltimateCanvas.canvas.prototype.passIsInEz = function(pass, possession){
	var attackersEndzone = this.getAttackersEndzone();

	if(attackersEndzone == UltimateCanvas.LEFT_EZ){
		if(pass.x >= this._options.endzone_width + this._options.inner_field_width){
			return true;
		}
	}else{
		if(pass.x <= this._options.endzone_width){
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

