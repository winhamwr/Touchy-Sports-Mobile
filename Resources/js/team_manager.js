TeamManager = function(){
	this.storage = arguments[0] || localStorage;

	this.init();
}

TeamManager.prototype.init = function() {
	this.load();
};

/**
 * All db-storable fields.
 */
TeamManager.prototype.STORABLE_FIELDS = {
	// Array of all saved teams
	'teams': ['TEAMMANAGER_TEAMS', UltimateTeam, new Array()]
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

	var field_j = this.storage.getItem(storage_key);

	if(field_j != null){
		this[field_name] = deserializeObject(field_type, field_j);
	}else{
		this[field_name] = field_default;
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

	this.storage.setItem(storage_key, field_j);
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