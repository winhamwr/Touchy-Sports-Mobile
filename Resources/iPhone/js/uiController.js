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
	this.addScoreTags();
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
	
	/* TODO: Need to bind an event to the score div click */
};

IPhoneUiController.prototype.showSubDialog(home_team, playerLeavingName) {
		this.subbingOut = playerLeavingName;
		Titanium.App.Properties.setString('subData', JSON.stringify(home_team.getBenchedPlayers()));
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

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
iPhoneUiController.ui.prototype.displayScore = function(team, ez, score) {
	var scoreTag = '';
	if (ez == 0) {
		scoreTag = '#scoreLeft';	// Left side score
	} else {
		scoreTag = '#scoreRight';	// Right side score
	}
	if(team == 0){
		// home score
		$(scoreTag).removeClass('scoreAway');	// this necessary?
		$(scoreTag).addClass('scoreHome');
	} else {
		// away score
		$(scoreTag).removeClass('scoreHome');	// this necessary?
		$(scoreTag).addClass('scoreAway');
	}
	$(scoreTag).html(score);
};

/*
 * Adds the score divs to the page
 */
iPhoneUiController.ui.prototype.addScoreTags = function() {
	var tagLeft = '<div id="scoreLeft" class="scoreDiv"><button>test</button></div>';
	var tagRight = '<div id="scoreRight" class="scoreDiv"></div>';
	$('body').append(tagLeft+tagRight);
};

ui_controller = IPhoneUiController;