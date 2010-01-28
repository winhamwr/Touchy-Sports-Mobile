Team = UltimateTeam;

function TeamCollection(team_data){
        if(typeof team_data=='undefined')
            team_data = new Object();

	var teams = Object();
	var team;
	for(var i in team_data){
		team = new Team();
		team.load(team_data[i]);
		teams.push(team.getPk());
	}

        return teams;
}


TeamManager = function(){
	this.init();
}

/**
 * All db-storable fields.
 */
TeamManager.prototype.STORABLE_FIELDS = {
	// Team to be used in any upcoming actions requiring team.
	'current_team': ['TEAMMANAGER_CURRENT_TEAM', Team],
	// Team to be used in any upcoming actions requiring opposing team.
	'opposing_team': ['TEAMMANAGER_OPPOSING_TEAM', Team],
	// Array of all saved teams
	'teams': ['TEAMMANAGER_TEAMS', TeamCollection]
};

/**
 * Get the javascript object for a given field from storage (or  cache).
 */
TeamManager.prototype._loadField = function(field_name) {
	if(this[field_name] != null){
		return this[field_name];
	}
	// Not in cache. Grab thee field from localstorage
	var storage_key = this.STORABLE_FIELDS[field_name][0];
	var field_type = this.STORABLE_FIELDS[field_name][1];

	var field_j = localStorage.getItem(storage_key);

	if(field_j != null){
		var field_data = JSON.parse(field_j);
		var field_obj = new field_type();
		field_obj.load(field_data);
		this[field_name] = field_obj;
	}
	return this[field_name];
};

/**
 * Save a field object to storage, taking in to account the field type.
 */
TeamManager.prototype._saveField = function(field_name) {
	// Not in cache. Grab thee field from localstorage
	var storage_key = this.STORABLE_FIELDS[field_name][0];

	var field_j = JSON.stringify(null);
	if(this[field_name] != null){
		field_j = JSON.stringify(this[field_name]);
	}

	localStorage.setItem(storage_key, field_j);
};
/**
 * Save all of the storable fields to the database.
 */
TeamManager.prototype.save = function() {
	for(var field_name in this.STORABLE_FIELDS){
		this._saveField(field_name);
	}
};

/**
 * Load all of this object's data from storage.
 */
TeamManager.prototype.load = function() {
	for(var field_name in this.STORABLE_FIELDS){
		this[field_name] = this._loadField(field_name);
	}
};

TeamManager.prototype.init = function() {
	this.load();
};

TeamManager.prototype.addStoredGame = function(new_id) {
	//TODO: Make the STORED_GAMES array a set (remove dupes)
	var game_ids = this.getStoredGames();

	game_ids.push(new_id);

	var game_ids_j	= JSON.stringify(game_ids);
	localStorage.setItem('STORED_GAMES', game_ids_j);
}

TeamManager.prototype.changeGame = function(unique_id) {
	this.unique_id = unique_id;
	localStorage.setItem('cur_game_id', unique_id);
	this.addStoredGame(this.unique_id);
}

TeamManager.prototype.continueGame= function(unique_id) {
	this.changeGame(unique_id);
}

TeamManager.prototype.startNewGame= function() {
	var game_ids = this.getStoredGames();

	var largest = 0;
	if(game_ids.length > 0){
		game_ids.sort();
		largest = game_ids[game_ids.length - 1];
	}
	var unique_id = largest + 1;

	this.changeGame(unique_id);

	return unique_id;
}

TeamManager.prototype.saveGame = function(ultimate_canvas) {
	var savable_keys = ['possession', 'home_endzone', 'away_endzone', 'home_score', 'away_score', 'points', 'passes', 'home_team']

	var saved_data = {}
	for(i in savable_keys){
		console.log('i:'+i);
		var key = savable_keys[i];
		console.log('key:'+key);
		saved_data[key] = ultimate_canvas[key];
	}


	this._storeGameData(JSON.stringify(saved_data));
};

TeamManager.prototype.loadGame = function(ultimate_canvas) {
	var game = this._getGameData();
	if(game != null){
		for(key in game){
			console.log('saved_key:'+key);
			console.log('saved_data:'+game[key]);
			ultimate_canvas[key] = game[key];
		}
	}
	// Load the home team object
	var home_team_d = game['home_team'];
	var home_team = new UltimateTeam(home_team_d['name'], home_team_d['players']);
	home_team.playersInPlay = home_team_d['playersInPlay'];

	ultimate_canvas['home_team'] = home_team;
};

TeamManager.prototype._getGameData= function() {
	var game = localStorage.getItem('game'+this.unique_id);
	var game_object = null;
	if(game != null){
		game_object = JSON.parse(game);
	}
	return game_object;
}

TeamManager.prototype._storeGameData = function(json_string) {
	localStorage.setItem('game'+this.unique_id, json_string);
}

TeamManager.prototype.gameExists = function() {
	var game = this._getGameData();

	if(game != null){
		return true;
	}else{
		return false;
	}
};

db_controller = TeamManager