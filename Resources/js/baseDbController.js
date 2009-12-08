BaseDbController = function(unique_id){
	this.init(unique_id);
}

BaseDbController.prototype.init = function(unique_id) {
	if(typeof(localStorage) == 'undefined' || localStorage == null){
		alert("no local storage available");
		localStorage = {};
		localStorage.setItem = function(foo, bar){return null};
		localStorage.getItem = function(foo, bar){return null};
		return;
	}

	this.unique_id = unique_id;
};


BaseDbController.prototype.saveGame = function(ultimate_canvas) {
	var savable_keys = ['possession', 'home_endzone', 'away_endzone', 'home_score', 'away_score', 'points', 'passes']

	var saved_data = {}
	for(i in savable_keys){
		console.log('i:'+i);
		var key = savable_keys[i];
		console.log('key:'+key);
		saved_data[key] = ultimate_canvas[key];
	}

	this.setGame(JSON.stringify(saved_data));
};

BaseDbController.prototype.loadGame = function(ultimate_canvas) {
	var game = this.getGame();
	if(game != null){
		for(key in game){
			console.log('saved_key:'+key);
			console.log('saved_data:'+game[key]);
			ultimate_canvas[key] = game[key];
		}
	}
};

BaseDbController.prototype.getGame = function() {
	var game = localStorage.getItem('game'+this.unique_id);
	var game_object = null;
	if(game != null){
		game_object = JSON.parse(game);
	}
	return game_object;
}

BaseDbController.prototype.setGame = function(json_string) {
	localStorage.setItem('game'+this.unique_id, json_string);
}

BaseDbController.prototype.gameExists = function() {
	var game = this.getGame();

	if(game != null){
		return true;
	}else{
		return false;
	}
};

db_controller = BaseDbController;