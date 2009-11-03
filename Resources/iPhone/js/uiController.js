if(!iPhoneUiController) var iPhoneUiController = {};

var currentToolbar = null;			// used to store the toolbar buttons, for hiding/showing the toolbar
var currentPlayerBar = null;		// used to store the playerBar, for hiding/showing the playerBar
									// using element id 'currentPlayerBar' will show the bar on the iPhone
var PLAYERBAR_COLOR = '#336699';	// the color of the playerBar

$.extend(iPhoneUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init();
	}
});

iPhoneUiController.ui.prototype = new BaseUiController.ui();
iPhoneUiController.ui.prototype.contructor = new iPhoneUiController.ui();

/*
 * Pops up an alert/message box displaying the given message.
 */
iPhoneUiController.ui.prototype.alert = function(msg) {
	var alerty = Titanium.UI.createAlertDialog({
		title:'TouchySports',
		message:msg,
		buttonNames:['OK']
	});
	alerty.show();
};

/*
    Creates an iPhone style toolbar with 8 buttons for use in landscape orientation.
	b1-b8 are strings for the button titles.
	
	This does not loop through an array, as passing (e) to the function ends up being
	'undefined', and using the value of the counter at the time ends up passing its
	final value to the event function (so in this case, 8) for all.
*/
function createToolbar(b1,b2,b3,b4,b5,b6,b7,b8) {
    var btn1 = Titanium.UI.createButton({
        title:b1,
        width:50
    });
    btn1.addEventListener('click', function() {
        handleButtonClick(0);
    });
    var btn2 = Titanium.UI.createButton({
        title:b2,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn2.addEventListener('click', function() {
        handleButtonClick(1);
    });
    var btn3 = Titanium.UI.createButton({
        title:b3,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn3.addEventListener('click', function() {
        handleButtonClick(2);
    });
    var btn4 = Titanium.UI.createButton({
        title:b4,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn4.addEventListener('click', function() {
        handleButtonClick(3);
    });
    var btn5 = Titanium.UI.createButton({
        title:b5,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn5.addEventListener('click', function() {
        handleButtonClick(4);
    });
    var btn6 = Titanium.UI.createButton({
        title:b6,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn6.addEventListener('click', function() {
        handleButtonClick(5);
    });
    var btn7 = Titanium.UI.createButton({
        title:b7,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn7.addEventListener('click', function() {
        handleButtonClick(6);
    });
    var btn8 = Titanium.UI.createButton({
        title:b8,
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        width:50
    });
    btn8.addEventListener('click', function() {
        handleButtonClick(7);
    });
	
	// this is used to keep the buttons evenly spaced
	var flexSpace = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	// save as the current toolbar
	curentToolbar = new Array(btn1,flexSpace,btn2,flexSpace,btn3,flexSpace,
		btn4,flexSpace,btn5,flexSpace,btn6,flexSpace,btn7,flexSpace,btn8)
    
    // now set the toolbar
    Titanium.UI.currentWindow.setToolbar(currentToolbar);
};

// TODO: This should call a method in the main game logic. Note: all bar button clicks use
// zero-based counting.
function handleButtonClick(playerNum) {
    Titanium.API.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Player'+playerNum+' button clicked');
};

/*
	Hides the toolbar.
*/
function hideToolbar() {
	Titanium.UI.currentWindow.setToolbar(null);
};

/*
	Shows the toolbar, if one has already been created. If not, writes an error to the
	console log.
*/
function showToolbar() {
	if (currentToolbar != null) {
		Titanium.UI.currentWindow.setToolbar(currentToolbar);
	} else {
		Titanium.API.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>showToolbar() called, but currentToolbar not set');
	}
};

/*
	Creates an iPhone style buttonBar that can be used in the navBar, content or toolbar areas.
	This function places it in the navBar (title) area.
*/
function createTopBar(playerNames) {
	currentPlayerBar = Titanium.UI.createButtonBar({
		labels:playerNames,
		color:PLAYERBAR_COLOR});
	buttonBar.addEventListener('click',function(e) {
		// TODO: This should call a method in the main game logic
		handleButtonClick(e.index);
	});
};

/*
	Shows the player bar, if one has been created.
*/
function showTopBar() {
	if (currentPlayerBar != null) {
		Titanium.UI.currentWindow.setTitleControl(currentPlayerBar);
	} else {
		Titanium.API.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>showPlayerBar() called, but currentPlayerBar not set');
	}
};

/*
	Hides the player bar.
*/
function hideTopBar() {
	Titanium.UI.currentWindow.setTitleControl(null);
};

/*
	TODO: Fix scoring
 *
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 *
iPhoneUiController.ui.prototype.displayScore = function(team, ez, score) {
	var context = this._canvas.getContext("2d");
	context.font = "bold 12px sans-serif";

	if(team == 0){
		// home score
		context.strokeStyle = "#9F4848";	// WHITE
		context.fillStyle = "#9F4848";	// WHITE
	} else {
		// away score
		context.strokeStyle = "#269926";	// WHITE
		context.fillStyle = "#269926";	// WHITE
	}

	if(context.fillText != null){
		if(ez == 0){
			// Left side score
			context.fillText(
				score,
				40,
				135);
		} else {
			// Right side score
			context.fillText(
				score,
				440,
				135);
		}
	} else {
		if(DEBUG == true){
			this.alert("Your device does not support text on canvas");
		}
	}
};
*/

ui_controller = iPhoneUiController.ui;