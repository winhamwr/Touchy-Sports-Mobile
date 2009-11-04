var ULTIMATE_STATUS_NOTSET = -1;
var ULTIMATE_STATUS_INPLAY = 0;
var ULTIMATE_STATUS_BENCHED = 1;
var ULTIMATE_STATUS_INJURED = 2;

ultimatePlayer = function(id, name, number, status, nickname) {
	this.id = id;
	this.name = name;
	this.number = number;
	this.status = status;
	this.nickname = nickname;
};