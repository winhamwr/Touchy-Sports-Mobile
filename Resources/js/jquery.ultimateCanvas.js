;(function($) {

UltimateCanvas = function(canvas, options) {
	this.canvas = canvas;
	this._options = options;
}

UltimateCanvas.HOME_TEAM = 0;
UltimateCanvas.AWAY_TEAM = 1;
UltimateCanvas.LEFT_EZ = 0;
UltimateCanvas.RIGHT_EZ = 1;

UltimateCanvas.prototype.init = function() {
	this.ui = new this._options.ui_controller(this.canvas);
	this.ui.init();
	this.db = new this._options.db_controller();
	this.db.continueGame(1);
	//this.db.startNewGame();
	this.home_team = this._options.home_team;

	this.ui.bindEvents(this);

	if(this.db.gameExists()){
		this.db.loadGame(this);
		this.draw();
	}else{
		this.initGame();
	}
};

UltimateCanvas.prototype.initGame =	function() {
	this.possession = UltimateCanvas.HOME_TEAM;
	this.home_endzone = UltimateCanvas.LEFT_EZ;
	this.away_endzone = UltimateCanvas.RIGHT_EZ;

	this.home_score = 0;
	this.away_score = 0;
	this.points = [];

	// Setting used to determine whether or not to choose players for away team, 0=don't choose player, 1=choose player
	this.choose_away_player = false;

	this.initPoint();
};

/**
 * Store info about the current point if there is one, and prepare a new one.
 */
UltimateCanvas.prototype.initPoint = function() {
	//Handle the last point
  	if(this.passes && this.passes.length >= 0){
		var point = {}
		point.passes = this.passes;
		point.home_score = this.home_score;
		point.away_score = this.away_score;
		// Determine who just scored and subtract that point. Score is the score at the start of the point
		if(this.possession == UltimateCanvas.HOME_TEAM){
			//away scored
			point.away_score -= 1;
		} else{
			//home scored
			point.home_score -= 1;
		}

		this.points.push(point);
	}

	//Init the new point
	this.passes = [];
	this.can_click = true;
	this.scoring_pass = false;
	this.subbing = false;

	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();

	this.draw();
	this.db.saveGame(this);
};

//
// EVENT HANDLERS
//

/**
 * Handle a field click to indicate a pass. Make a decision whether or not we should use the player buttons.
 */
UltimateCanvas.prototype.handlePass = function(event) {
	var c = this;

        if(!c.choose_away_player){
                if(c.possession==UltimateCanvas.HOME_TEAM){
                        c.handleHomePass(event);
                } else{
                        c.handleAwayPass(event);
                }
        } else{
                c.handleHomePass(event);
        }
};

/**
 * Handle a field click to indicate a pass made by the home team. The player buttons are enabled.
 */
UltimateCanvas.prototype.handleHomePass = function(event) {
        var c = this;

        // If clicking is disabled, don't do anything
        if(c.can_click == false){
                c.ui.alert("Whoa! Hold your horses. Who caught that last pass?");
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
 * Handle a field click to indicate a pass by the away team.  The player buttons are disabled.
 */
UltimateCanvas.prototype.handleAwayPass = function(event) {
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

UltimateCanvas.prototype.handleTurnover = function(event) {
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

UltimateCanvas.prototype.handlePlayerClick = function(playerClicked) {
	this.ui.hideTurnoverButton();
	this.ui.hidePlayerButtons();

	if(this.scoring_pass){
		this.endPoint(this.possession);
	} else if (this.subbing) {
		this.showSub(playerClicked);
	} else {
		// Now that we've selected a player, we can handle field clicks again
		this.can_click = true;
	}
};

UltimateCanvas.prototype.handleSub = function() {
	this.ui.hideTurnoverButton();
	this.ui.hideSubButton();
	this.ui.hideUndoButton();
	this.ui.showPlayerButtons();
	this.subbing = true;
};

UltimateCanvas.prototype.showSub = function(playerLeavingGame) {
	this.ui.showSubDialog(this.home_team, playerLeavingGame);
};

UltimateCanvas.prototype.hideSub = function (requiresUpdate) {
	if (requiresUpdate) {
		this.ui.updatePlayerNames(this.home_team.getPlayingPlayerNames());
	}
	this.ui.showTurnoverButton();	// should we show this here, or only after a pass?
	this.ui.showSubButton();
	this.ui.showUndoButton();
	this.can_click = true;
	this.subbing = false;
};

UltimateCanvas.prototype.handleUndo = function(event) {
	if(this.can_click){
		//Undo a player choice
		if(this.passes.length == 0){
			//Need to undo the last score
			if(this.home_score + this.away_score == 0){
				//Trying to undo the first pass. Weird?
				this.ui.alert("Undoing nothing is kind of a metaphysical thing to try. Whoaaaa. Dude.");
				return null;
			}

			var point = this.points.pop();

			// Switch the endzones
			var a_ez = this.away_endzone;
			this.away_endzone = this.home_endzone;
			this.home_endzone = a_ez;

			// Switch posession
			if(this.possession == UltimateCanvas.HOME_TEAM){
				this.possession = UltimateCanvas.AWAY_TEAM;
			} else{
				this.possession = UltimateCanvas.HOME_TEAM;
			}

			this.passes = point.passes;
			this.home_score = point.home_score;
			this.away_score = point.away_score;
			this.scoring_pass = true;

		}

		if(this.possession == UltimateCanvas.AWAY_TEAM && !this.choose_away_player){
			this.can_click = true;
			// Now this is just like undoing a normal pass, because we don't care about players
		} else{
			this.can_click = false;
			this.getPlayer();
			this.draw();
			return null;
		}

		//Undo the player selection for the last pass
		//Don't have much to do right now, cause we don't actually record players
	}

	//Undo a pass
	this.passes.pop();

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
	this.ui.displayScore(UltimateCanvas.HOME_TEAM, this.home_endzone, this.home_score);
	this.ui.displayScore(UltimateCanvas.AWAY_TEAM, this.away_endzone, this.away_score);

	var player_names = this.home_team.getPlayingPlayerNames();
	this.ui.updatePlayerNames(player_names);

};

UltimateCanvas.prototype.drawPasses = function(){
	this.ui.drawPasses(this.passes);
}

UltimateCanvas.prototype.getPlayer = function() {
	this.ui.showTurnoverButton();
	this.ui.showPlayerButtons();
};

UltimateCanvas.prototype.displayPossessionIndicator = function() {
	var attackersEndzone = this.getAttackersEndzone();

	if(attackersEndzone == UltimateCanvas.LEFT_EZ){
		this.ui.displayPossessionIndicator('right');
	} else {
		this.ui.displayPossessionIndicator('left');
	}
};

/**
 * Determine the attackers endzone
 */
UltimateCanvas.prototype.getAttackersEndzone = function(){
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
UltimateCanvas.prototype.passIsInEz = function(pass, possession){
	var attackersEndzone = this.getAttackersEndzone();

	if(attackersEndzone == UltimateCanvas.LEFT_EZ){
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
UltimateCanvas.prototype.endPoint = function(possession){
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

        this.ui.hideTurnoverButton();

	// UiController
	this.ui.alert("omg. You scored!. You've got "+score+" points!");
	if(score >= this._options.score_limit){
		this.ui.alert("Whoa. You totally scored enough points to make you the winner!");
		this.initGame();
	} else {
		this.initPoint();
	}
};

/*
 * Registers the jquery plugin function
 */
$.fn.ultimateCanvas = function(options) {

	defaults = {
		score_limit			: 7
	};

	options = $.extend(defaults, options);

	var uc = new UltimateCanvas($(this), options);
	uc.init();
	return uc;
};

})(jQuery);

