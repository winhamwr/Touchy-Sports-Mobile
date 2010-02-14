TeamManager = function(load_to_start, storage){
	if ( !(this instanceof arguments.callee) )
	   throw Error("Constructor called as a function");

	if(typeof(load_to_start) == 'undefined'){
		load_to_start = true;
	}
	this.storage = storage || localStorage;

	this.init(load_to_start);
}

/**
 * Initialize a TeamManager to keep track of all of the persisted teams.
 * 
 * @param should_load Whether or not to load the stored teams on init. Defaults to true.
 **/
TeamManager.prototype.init = function(should_load) {
	if(should_load){
		this.load();
	}
};

/**
 * All db-storable fields.
 */
TeamManager.prototype.STORABLE_FIELDS = {
	// Array of all saved teams
	//'name': [storage key, object type, default value, is array]
	'teams': ['TEAMMANAGER_TEAMS', UltimateTeam, new Array(), true]
};

// Member data that needs to be deserialized in to objects
TeamManager.NESTED_OBJECTS = {'teams': UltimateTeam};


/**
 * Add a team to the list of persisted teams, holding the team name unique.
 * ie. if you add a team with a name that already exists, it will overwrite
 * that team.
 *
 * @param new_team The UltimateTeam object to add.
 **/
TeamManager.prototype.addTeam = function(new_team) {
	if(typeof(this.teams) == 'undefined'){
		this.teams = new Array();
	}
	var matching_index = null;
	for(var i in this.teams){
		if(this.teams[i].name == new_team.name){
			matching_index = i;
		}
	}

	if(matching_index != null){
		this.teams[matching_index] = new_team;
	}else{
		this.teams.push(new_team);
	}
}

TeamManager.prototype.getTeamNames = function() {
	var team_names = Array();

	for(var i in this.teams){
		team_names.push(this.teams[i].name);
	}

	return team_names;
}

TeamManager.prototype.getTeam = function(name) {
	for(var i in this.teams){
		if(this.teams[i].name == name){
			return this.teams[i];
		}
	}	
	return null;
}

/**
 * Gets the number of players currently on a team's roster.
 */
TeamManager.prototype.getNumPlayers = function(teamName) {
	var team = this.getTeam(teamName);
	return team.getNumPlayers();
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
		this._loadField(field_name);
	}
};

/**
 * Gets the number of teams in storage
 */
TeamManager.prototype.getNumTeams = function() {
    var type = typeof(this.teams);
    var numTeams = 0;
    if(type == 'undefined' ) {
    } else {
        numTeams = this.teams.length;
    }

    return numTeams;
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
TeamManager.prototype._saveField = function(field_name) {
	var storage_key = this.STORABLE_FIELDS[field_name][0];

	var field_j = JSON.stringify(null);
	if(this[field_name] != null){
		field_j = JSON.stringify(this[field_name]);
	}

	this.storage.setItem(storage_key, field_j);
};