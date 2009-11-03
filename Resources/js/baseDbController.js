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

	localStorage.setItem('game', JSON.stringify(saved_data));
};

BaseDbController.prototype.loadGame = function(ultimate_canvas) {
	var game = localStorage.getItem('game');
	if(game != null){
		var saved_data = JSON.parse(localStorage.getItem('game'));

		for(key in saved_data){
			console.log('saved_key:'+key);
			console.log('saved_data:'+saved_data[key]);
			ultimate_canvas[key] = saved_data[key];
		}
	}
};

BaseDbController.prototype.gameExists = function() {
	var game = localStorage.getItem('game');
	if(game != null){
		var saved_uc = JSON.parse(localStorage.getItem('game'));
	}else{
		var saved_uc = null;
	}

	if(saved_uc != null){
		return true;
	}else{
		return false;
	}
};

db_controller = BaseDbController;