
// see: https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Exception_Handling_Statements/throw_Statement
// for exception handling info

InvalidDeserializationObjectException = function(message) {
	this.message=message;
	this.name="InvalidDeserializationObjectException";
};

// Make the exception convert to a pretty string when used as
// a string (e.g. by the error console)
InvalidDeserializationObjectException.prototype.toString = function() {
	return this.name + ': "' + this.message + '"';
};

/**
 * Deserialize a conforming object from its required data, taking in to account
 * members that are objects that need deserialization themselves.
 *
 * Conforming objects must define a NESTED_OBJECTS static member object with the
 * name of the objects needing deserialization and their type of object. Objects
 * may optionally define a ``fromJSON`` member functoin that will be called with
 * the JSON string object after deserialization is completed.
 *
 * @param ToObject The object type this data will be deserialized to.
 * @param json The json containing this object's data.
 * @return An UltimatePlayer object with the appropriate data set.
 **/
deserializeObject = function(ToObject, json){
	// Check conformance of the ToObject to make sure it's kosher for deserialization
	if(typeof(ToObject.NESTED_OBJECTS) == 'undefined') {
		throw new InvalidDeserializationObjectException('Deserializable objects must have a NESTED_OBJECTS static member')
	}

	var j_obj = JSON.parse(json);
	var obj = new ToObject();

	for(var property_name in j_obj){
		if(property_name in ToObject.NESTED_OBJECTS){
			// This is a nested object, call its deserialize
			var member_obj_type = ToObject.NESTED_OBJECTS[property_name];
			var member_obj_json_data = JSON.stringify(j_obj[property_name]);
			var deserialized_member_obj = deserializeObject(member_obj_type, member_obj_json_data);
			obj[property_name] = deserialized_member_obj;
		}else{
			// Easy, just assign the data
			obj[property_name] = j_obj[property_name];
		}
	}

	if(typeof(obj.fromJSON) != 'undefined')
		obj.fromJSON(json);

	return obj;
};
