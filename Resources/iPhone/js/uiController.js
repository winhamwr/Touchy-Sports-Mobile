function IPhoneUiController(canvas) {
	this.canvas = canvas;
	this.subbingOut = null;
	this.subbingIn = null;

	// stores the toolbar buttons, for hiding/showing the toolbar
	this.currentToolbar = null;

	// used to store the playerBar, for hiding/showing the playerBar
	// using element id 'currentPlayerBar' will show the bar on the iPhone
	this.currentPlayerBar = null;

	// the color of the playerBar
	this.PLAYERBAR_COLOR = '#336699';
}

mixin(IPhoneUiController.prototype, uiControlling);

IPhoneUiController.prototype.init = function() {
	this.WIDTH_OFFSET = 0;
	this.HEIGHT_OFFSET = 0;

	// Initialize the field
	this.initField();

    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
	$('#sub_b').append('<button>Sub</button>');
};

/*
 * Pops up an alert/message box displaying the given message.
 */
IPhoneUiController.prototype.alert = function(msg) {
	var alerty = Titanium.UI.createAlertDialog({
		title:'TouchySports',
		message:msg,
		buttonNames:['OK']
	});
	alerty.show();
};

IPhoneUiController.prototype.bindEvents = function(ultimate_canvas) {
	ultimate_canvas.canvas.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	for (var i=1;i<8;i++) {
		var playerButton = $('#player-button-'+i);
		playerButton.click(function() {
			ultimate_canvas.handlePlayerClick($(this).text());
		});
	}

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		ultimate_canvas.handleTurnover();
	});

	var undo_b = $('#undo_b')
	undo_b.click(function(event) {
		ultimate_canvas.handleUndo();
	});

	var sub_b = $('#sub_b')
	sub_b.click(function(event) {
		ultimate_canvas.handleSub();
	});
	
	// initialize the substitution dialog
	Titanium.UI.currentView.addEventListener('focused', function() {
		var subFlag = Titanium.App.Properties.getString('subFlag');
		if (subFlag=='updated') {
			subUpdated(ultimate_canvas);
		} else if (subFlag=='cancelled') {
			subCancelled(ultimate_canvas);
		}
	});
};

IPhoneUiController.prototype.showSubDialog(home_team, playerLeavingName) {
		this.subbingOut = playerLeavingName;
		Titanium.App.Properties.setString('subData', JSON.stringify(home_team.getBenchedPlayers));
		var dlgTitle = 'Who\'s going in for ' + this.subbingOut + '?';
		var dlgBtn = Titanium.UI.createButton({
			title:'Cancel',
			style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
        dlgBtn.addEventListener('click', function(e) {
			// handle cancelling of the substitution dialog
			Titanium.App.Properties.setString('complete');
			Titanium.UI.currentWindow.close();
        });
		var win = Titanium.UI.createWindow({
			url:'../substitution.html',
			name:'substitution',
			title:dlgTitle,
			fullscreen:false,
			orientation:'either'
		}); // orientation:'landscape'
		win.setLeftNavButton(dlgBtn);
		// Titanium.UI.currentWindow.setBarColor('#336699');
		Titanium.App.Properties.setString('subFlag', 'waiting');
		win.open({
			modal:true,
			animated:true
		});
};

IPhoneUiController.prototype.subUpdated(ultimate_canvas) {
	this.subbingIn = Titanium.App.Properties.getString('subData');
	ultimate_canvas.home_team.sub(this.subbingOut, this.subbingIn);
	/* TODO: update the player buttons */
	ultimate_canvas.hideSub(true);
	Titanium.App.Properties.setString('subFlag', 'complete');
	this.subbingIn = null;
	this.subbingOut = null;
};

IPhoneUiController.prototype.subCancelled(ultimate_canvas) {
	ultimate_canvas.hideSub(false);
};

ui_controller = IPhoneUiController;