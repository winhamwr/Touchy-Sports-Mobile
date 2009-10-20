if(!WebUiController) var WebUiController = {};

$.extend(WebUiController, {

	ui	: function(options) {
		this._options = options;

		this.init();
	}
});

WebUiController.ui.prototype.init = function() {
};

/*
 * Pops up an alert/message box displaying the given message.
 */
WebUiController.ui.prototype.alert = function(msg) {
	alert(msg);
};

ui_controller = WebUiController.ui;