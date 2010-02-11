/**
 * Create a new UltimateGame.
 *
 * Required options are:
 * user_team- UltimateTeam object that the user is recording for
 * opposing_team_name
 *
 * Optional:
 * user_starts_posession- true or false
 * user_starts_going_left- true or false
 * max_players_on_field- The number of players per team on the field at a time
 */
UltimateGame = function(options) {
	// See: http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");

	this._options = $.extend(UltimateGame.DEFAULTS, options);

	this.init(this._options.user_team, this._options.opposing_team_name);
	delete this._options.user_team;
	delete this._options.opposing_team_name;
};

UltimateGame.REQUIRED = ['user_team', 'opposing_team_name'];
UltimateGame.DEFAULTS = {
	user_starts_posession: true,

	user_starts_going_left: true,

	max_players_on_field: 7

};

UltimateGame.NESTED_OBJECTS = {
	'user_team': UltimateTeam
};

UltimateGame.prototype.init = function(user_team, opposing_team_name) {
	this.user_team = user_team || null;
	this.opposing_team_name = opposing_team_name || null;
};

UltimateGame.prototype.toString = function() {
	if(typeof(this.user_team) == 'undefined' || this.user_team == null){
		return 'Game';
	}
	return "Game: <"+this.user_team.name+"> versus <"+this.opposing_team_name+">";
};

UltimateGame.prototype.getPk = function() {
	return this.pk;
}

UltimateGame.prototype.setPk = function(pk) {
	this.pk = pk;
}