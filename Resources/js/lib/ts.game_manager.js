GameManager = function(load_to_start, storage){
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");

	if(typeof(load_to_start) == 'undefined'){
		load_to_start = true;
	}
	this.storage = storage || localStorage;

	this.init(load_to_start);
}

/**
 * Initialize a GameManager to keep track of all of the persisted games.
 * 
 * @param should_load Whether or not to load the stored games on init. Defaults to true.
 **/
GameManager.prototype.init = function(should_load) {
	if(should_load){
		this.load();
	}
};

/**
 * All db-storable fields.
 */
GameManager.prototype.STORABLE_FIELDS = {
	// Array of all saved games
	//'name': [storage key, object type, default value, is array]
	'games': ['GAMEMANAGER_GAMES', UltimateGame, new Array(), true]
};

// Member data that needs to be deserialized in to objects
GameManager.NESTED_OBJECTS = {'games': UltimateGame};


/**
 * Add a game to the list of persisted games, using the game's pk too hold them unique.
 * ie. if you add a game with a pk that already exists, it will overwrite that
 * game.
 *
 * @param new_obj The UltimateGame object to add.
 **/
GameManager.prototype.addGame = function(new_obj) {
	if(typeof(this.games) == 'undefined'){
		this.games = new Array();
	}
	if(new_obj.getPk() == null){
		// Brand new object
		new_obj.setPk(this.games.length);
		this.games.push(new_obj);
	}else{
		// Update to existing object
		var matching_index = null;
		for(var i in this.games){
			if(this.games[i].getPk() == new_obj.getPk()){
				matching_index = i;
			}
		}
		this.games[matching_index] = new_obj;
	}
}

GameManager.prototype.getGameNames = function() {
	var game_names = new Array();

	for(var i in this.games){
		game_names.push(this.games[i].toString());
	}

	return game_names;
}

GameManager.prototype.getGame = function(pk) {
	for(var i in this.games){
		if(this.games[i].getPk() == pk){
			return this.games[i];
		}
	}	
	return null;
}
/**
 * Save all of the storable fields to the database.
 */
GameManager.prototype.save = function() {
	for(var field_name in this.STORABLE_FIELDS){
		this._saveField(field_name);
	}
};

/**
 * Load all of this object's data from storage.
 */
GameManager.prototype.load = function() {
	for(var field_name in this.STORABLE_FIELDS){
		this._loadField(field_name);
	}
};

/**
 * Get the javascript object for a given field from storage (or  cache).
 */
GameManager.prototype._loadField = function(field_name) {
	if(this[field_name] != null){
		return this[field_name];
	}
	// Not in cache. Grab thee field from localstorage
	var storage_key = this.STORABLE_FIELDS[field_name][0];
	var field_type = this.STORABLE_FIELDS[field_name][1];
	var field_default = this.STORABLE_FIELDS[field_name][2];
	var is_array = this.STORABLE_FIELDS[field_name][3];

	var field_j = this.storage.getItem(storage_key);

	if(field_j != null){
		if(!is_array){
			this[field_name] = deserializeObject(field_type, field_j);
		} else { // Arrays need deserializeObject called on each element
			var field_array = JSON.parse(field_j);
			var deserialized_array = new Array();
			for(var i in field_array){
				var array_element = field_array[i];
				var array_element_j = JSON.stringify(array_element);
				
				var deserialized_element = deserializeObject(field_type, array_element_j);
				deserialized_array.push(deserialized_element);
			}
			this[field_name] = deserialized_array;
		}
	}else{
		this[field_name] = field_default;
	}
	return this[field_name];
};

/**
 * Save a field object to storage,
 */
GameManager.prototype._saveField = function(field_name) {
	var storage_key = this.STORABLE_FIELDS[field_name][0];

	var field_j = JSON.stringify(null);
	if(this[field_name] != null){
		field_j = JSON.stringify(this[field_name]);
	}

	this.storage.setItem(storage_key, field_j);
};