BaseDbController = function(){
	this.init();
}

BaseDbController.prototype.init = function() {
	if(typeof(localStorage) == 'undefined' || localStorage == null){
		alert("no local storage available");
		localStorage = {};
		localStorage.setItem = function(foo, bar){return null};
		localStorage.getItem = function(foo, bar){return null};
		return;
	}
	var cur_game_id = localStorage.getItem('cur_game_id');
	if(cur_game_id != null){ // We already have a game going
		this.continueGame(cur_game_id);
	} 
	return;
};

BaseDbController.prototype.getStoredGames = function() {
	var game_ids_j = localStorage.getItem('STORED_GAMES');

	var game_ids = [];
	if(game_ids_j != null){
		game_ids = JSON.parse(game_ids_j);
	}
	return game_ids;
}

BaseDbController.prototype.addStoredGame = function(new_id) {
	//TODO: Make the STORED_GAMES array a set (remove dupes)
	var game_ids = this.getStoredGames();

	game_ids.push(new_id);

	var game_ids_j	= JSON.stringify(game_ids);
	localStorage.setItem('STORED_GAMES', game_ids_j);
}

BaseDbController.prototype.changeGame = function(unique_id) {
	this.unique_id = unique_id;
	localStorage.setItem('cur_game_id', unique_id);
	this.addStoredGame(this.unique_id);
}

BaseDbController.prototype.continueGame= function(unique_id) {
	this.changeGame(unique_id);
}

BaseDbController.prototype.startNewGame= function() {
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

BaseDbController.prototype.saveGame = function(ultimate_canvas) {
	var savable_keys = [
		'possession',
		'home_endzone',
		'away_endzone',
		'home_score',
		'away_score',
		'points',
		'passes',
		'home_team'
	];

	var saved_data = {}
	for(i in savable_keys){
		console.log('i:'+i);
		var key = savable_keys[i];
		console.log('key:'+key);
		saved_data[key] = ultimate_canvas[key];
	}


	this._storeGameData(JSON.stringify(saved_data));
};

BaseDbController.prototype.loadGame = function(ultimate_canvas) {
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

BaseDbController.prototype._getGameData= function() {
	var game = localStorage.getItem('game'+this.unique_id);
	var game_object = null;
	if(game != null){
		game_object = JSON.parse(game);
	}
	return game_object;
}

BaseDbController.prototype._storeGameData = function(json_string) {
	localStorage.setItem('game'+this.unique_id, json_string);
}

BaseDbController.prototype.gameExists = function() {
	var game = this._getGameData();

	if(game != null){
		return true;
	}else{
		return false;
	}
};

db_controller = BaseDbController;