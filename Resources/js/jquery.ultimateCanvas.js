;(function($) {

UltimateCanvas = function(canvas, options) {
	this.canvas = canvas;
	this._options = options;
}

UltimateCanvas.USER_TEAM = 0;
UltimateCanvas.OPPOSING_TEAM = 1;
UltimateCanvas.LEFT_EZ = 0;
UltimateCanvas.RIGHT_EZ = 1;

UltimateCanvas.prototype.init = function() {
	this.ui = new this._options.ui_controller(this.canvas);
	this.ui.init();

	this.game = this._options.game;

	this.ui.bindEvents(this);

	this.initPoint();
	this.ui.showGameOpeningDialog(this.game.user_team.getPlayingPlayerNames());
};

/**
 * Store info about the current point if there is one, and prepare a new one.
 */
UltimateCanvas.prototype.initPoint = function() {
	//Handle the last point
  	if(this.game.passes && this.game.passes.length >= 0){
		var point = {}
		point.passes = this.game.passes;
		point.user_score = this.game.user_score;
		point.opposing_score = this.game.opposing_score;
		point.user_players = this.game.user_team.getPlayingPlayerNames();
		// Determine who just scored and subtract that point. Score is the score at the start of the point
		if(this.game.user_has_possession){
			point.opposing_score -= 1;
		} else{
			point.user_score -= 1;
		}

		this.game.points.push(point);
	}

	//Init the new point
	this.game.passes = [];

	this.can_click = true;
	this.scoring_pass = false;
	this.subbing = false;

	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();
	this.ui.hideSubButton();	/* TODO: Does this work here? */

	this.draw();

	var gm = new GameManager();
	gm.addGame(this.game);
	gm.save();
};

//
// EVENT HANDLERS
//

/**
 * Handle a field click to indicate a pass. Make a decision whether or not we should use the player buttons.
 */
UltimateCanvas.prototype.handlePass = function(event) {
	var c = this;
	if(c.game.user_has_possession){
		c.handleUserPass(event);
	} else{
		c.handleOpposingPass(event);
	}
};

/**
 * Handle a field click to indicate a pass made by the user team. The player buttons are enabled.
 */
UltimateCanvas.prototype.handleUserPass = function(event) {
	var c = this;

	// If clicking is disabled, don't do anything
	if(c.can_click == false){
		if(c.subbing == true) {
			c.ui.alert("Doh! Finish subbing or click the No Sub button.");
		} else {
			c.ui.alert("Whoa! Hold your horses. Who caught that last pass?");
		}
		return;
	}
	c.can_click = false; // No more clicks until we select the player

	var new_pass = {
		"x":event.clientX,
		"y":event.clientY,
		"team":'USER',
		'receiver':null
	};
	c.game.passes.push(new_pass);

	if(c.passIsInEz(new_pass, c.game.user_has_possession)){
		c.handleEzCatch();
	}

	c.getPlayer();
	c.draw();
};

/**
 * Handle a field click to indicate a pass by the opposing team.  The player buttons are disabled.
 */
UltimateCanvas.prototype.handleOpposingPass = function(event) {
	var c = this;

	// If clicking is disabled, don't do anything
	if(c.can_click == false){
		c.ui.alert("Doh! Finish subbing or click the No Sub button.");
		return
	}
		
	var new_pass = {
		"x":event.clientX,
		"y":event.clientY,
		"team":'OPPOSING',
		'receiver':null
	};
	c.game.passes.push(new_pass);

	if(c.passIsInEz(new_pass, c.game.user_has_possession)){
		c.handleEzCatch();
	}

	c.draw();

	if(this.scoring_pass){
		this.endPoint(this.game.user_has_possession);
	}

	c.ui.showTurnoverButton();
};

UltimateCanvas.prototype.handleTurnover = function(event) {
	var c = this;

	// Switch possession
	c.game.user_has_possession = ! c.game.user_has_possession;

	c.ui.hideTurnoverButton();
	c.ui.hidePlayerButtons();

	var last_point = c.game.passes.pop()
	c.game.passes = [last_point]
	c.can_click = true;

	c.draw();
};

UltimateCanvas.prototype.handlePlayerClick = function(playerClicked) {
	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();

	if(this.scoring_pass){
		this.logReception(playerClicked)
		this.endPoint(this.game.user_has_possession);
	} else if (this.subbing) {
		this.showSub(playerClicked);
	} else {
		this.logReception(playerClicked)
		// Now that we've selected a player, we can handle field clicks again
		this.can_click = true;
	}
};

/**
 *Log a player as having been the receiver on the most recent pass.
 */
UltimateCanvas.prototype.logReception = function(player) {
	if(player == null){
		console.log("trying to log a reception for a null player");
		return;
	}
	var last_pass = this.game.passes.pop();
	last_pass['receiver'] = player;
	this.game.passes.push(last_pass);
}

UltimateCanvas.prototype.startSubbing = function() {
	this.ui.hideTurnoverButton();
	// next line is commented out, as it is now a "done" button for substitution
	//this.ui.hideSubButton();
	this.ui.showSubButton();
	this.ui.hideUndoButton();
	this.ui.showPlayerButtons();
	/* TODO: Should show some notification that substitutions are happening here */
	this.can_click = false;
	this.subbing = true;
};

UltimateCanvas.prototype.showSub = function(playerLeavingGame) {
	this.ui.showSubDialog(this.game.user_team, playerLeavingGame);
};

/**
 * Called when the Substitution dialog box is closed and no substitution is required.
 */
UltimateCanvas.prototype.handleSubDialogCancel = function () {
	/* TODO: Do we want to continue subbing until the user clicks "No Sub"?
	this.ui.showTurnoverButton();	// should we show this here, or only after a pass?
	this.ui.showUndoButton();
	this.ui.hideSubButton();
	this.ui.hidePlayerButtons();
	this.can_click = true;
	this.subbing = false;
	*/
	this.playPoint();
};

/**
 * Called when the Game Info dialog box is closed and no substitution is required.
 */
UltimateCanvas.prototype.playPoint = function () {
	// user clicked cancel in the sub dialog
	this.ui.showTurnoverButton();	// should we show this here, or only after a pass?
	this.ui.showUndoButton();
	this.ui.hideSubButton();
	this.ui.hidePlayerButtons();
	this.can_click = true;
	this.subbing = false;
};

/**
 * Called when the Substitution dialog box is closed and a substitution is required.
 */
UltimateCanvas.prototype.makeSubstitution = function (subbingOut, subbingIn) {
	if (subbingIn == null) {
		this.handleDialogClose();
	}
	// make the substitution
	this.game.user_team.sub(subbingOut, subbingIn);
	// update the player bar and show the player buttons
	this.ui.updatePlayerNames(this.game.user_team.getPlayingPlayerNames());
	this.ui.showPlayerButtons();
	// continue subbing until the user clicks the No Sub button or the Cancel button in the sub dialog
	this.subbing = true;
};

UltimateCanvas.prototype.handleUndo = function(event) {
	if(this.can_click){
		//Undo a player choice
		if(this.game.passes.length == 0){
			//Need to undo the last score
			if(this.game.user_score + this.game.opposing_score == 0){
				//Trying to undo the first pass. Weird?
				this.ui.alert("Undoing nothing is kind of a metaphysical thing to try. Whoaaaa. Dude.");
				return;
			}

			var point = this.game.points.pop();

			// Switch endzones and possession
			this.game.user_attacking_right = ! this.game.user_attacking_right;
			this.game.user_has_possession = ! this.game.user_has_possession;

			this.game.passes = point.passes;
			this.game.user_score= point.user_score;
			this.game.opposing_score = point.opposing_score;
			this.scoring_pass = true;

		}

		if(! this.game.user_has_possession){
			this.can_click = true;
			// Now this is just like undoing a normal pass, because we don't care about players
		} else{
			this.can_click = false;
			this.getPlayer();
			this.draw();
			return;
		}

		//Undo the player selection for the last pass
		//Don't have much to do right now, cause we don't actually record players
	}

	//Undo a pass
	this.game.passes.pop();

	//If we're undoing from a score, it's not a score pass anyore
	this.scoring_pass = false;

	this.handlePlayerClick(); //Works just like they selected a player
	this.draw();
};

//
// DRAWING
//

UltimateCanvas.prototype.draw = function(){
	this.ui.draw();
	this.displayPossessionIndicator();
	this.drawPasses();
	this.ui.displayScore(this.game.user_attacking_right, this.game.user_score, this.game.opposing_score);

    /* TODO: need to use the variable for opposing team name here instead of 'Nannies' */
    this.ui.displayTeamPossession(
		this.game.user_team.name, this.game.opposing_team_name, this.game.user_has_possession);

	var player_names = this.game.user_team.getPlayingPlayerNames();
	this.ui.updatePlayerNames(player_names);

};

UltimateCanvas.prototype.drawPasses = function(){
	this.ui.drawPasses(this.game.passes);
}

UltimateCanvas.prototype.getPlayer = function() {
	this.ui.showTurnoverButton();
	this.ui.showPlayerButtons();
};

UltimateCanvas.prototype.displayPossessionIndicator = function() {
	if((this.game.user_has_possession && this.game.user_attacking_right) || (! this.game.user_has_possession && ! this.game.user_attacking_right)){
		// Attacking right
		this.ui.displayPossessionIndicator('right');
	}else{
		this.ui.displayPossessionIndicator('left');
	}
};

/**
 * Determine if a pass click is in the endzone.
 */
UltimateCanvas.prototype.passIsInEz = function(pass, user_has_possession){
	if((user_has_possession && this.game.user_attacking_right) || (! user_has_possession && ! this.game.user_attacking_right)){
		// Attacking right EZ
		if(pass.x >= this.ui.field.ez_w + this.ui.field.inner_w){
			return true;
		}
	}else{
		if(pass.x <= this.ui.field.ez_w){
			return true;
		}
	}

	return false;
};

/**
 * Called when a catch was in the endzone.
 */
UltimateCanvas.prototype.handleEzCatch = function(){
	// This was a scoring pass.
	// We want to end the point after the user picks the catcher
	this.scoring_pass = true;
};

/**
 * Called after the person who caught the point is selected. Wraps up the point
 * and either starts another or ends the game.
 */
UltimateCanvas.prototype.endPoint = function(user_has_possession){
	if(user_has_possession){
		this.game.user_score++;
	}else{
		this.game.opposing_score++;
	}

	// Switch endzones and possession
	this.game.user_attacking_right = ! this.game.user_attacking_right;
	this.game.user_has_possession = ! this.game.user_has_possession;

	this.ui.hideTurnoverButton();

	this.initPoint();
	this.ui.showGameInfoDialog(this.game.user_team.name, this.game.user_score, this.game.opposing_team_name, this.game.opposing_score);	// a point was scored, but the game isn't over--show the status
};

/*
 * Registers the jquery plugin function
 */
$.fn.ultimateCanvas = function(options) {

	var defaults = {};

	options = $.extend(defaults, options);

	var uc = new UltimateCanvas($(this), options);
	uc.init();
	return uc;
};

})(jQuery);

