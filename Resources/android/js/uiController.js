function AndroidUiController(canvas) {
	this.canvas = canvas;
}

mixin(AndroidUiController.prototype, uiControlling);

AndroidUiController.prototype.init = function() {
	this.WIDTH_OFFSET = 0;
	this.HEIGHT_OFFSET = -40;

	this.initField();
};

AndroidUiController.prototype.bindEvents = function(ultimate_canvas) {

	ultimate_canvas.canvas.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	for (var i=1;i<8;i++) {
		var playerButton = $('#player-button-'+i);
		playerButton.click(function() {
			ultimate_canvas.handlePlayerClick($(this));
		});
	}

//	var turnover_b = $('#turnover_b')
//	turnover_b.click(function(event) {
//		ultimate_canvas.handleTurnover();
//	});

//	var undo_b = $('#undo_b')
//	undo_b.click(function(event) {
//		ultimate_canvas.handleUndo();
//	});

        this.sub_button.addEventListener('click', function(e){
            ultimate_canvas.handleSub();
        })

        this.undo_button.addEventListener('click',function(e) {
            alert('Undo button pressed.');
            ultimate_canvas.handleUndo();
        });

        this.turnover_button.addEventListener('click',function(e) {
            ultimate_canvas.handleTurnover();
        });

//        var player_button_bar = Titanium.UI.createButtonBar({
//            id:'#player-bar',
//            color:'#ffffff'
//        });
//        player_button_bar.addEventListener('click',function(e) {
//            ultimate_canvas.handlePlayerClick(event);
//        });
}

/*
 * Pops up an alert/message box displaying the given message.
 */
AndroidUiController.prototype.alert = function(msg) {
        var myalert = Titanium.UI.createAlertDialog();
        myalert.setMessage(msg);
        myalert.setButtonNames(['OK']);
        myalert.show();
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
AndroidUiController.prototype.displayScore = function(team, ez, score) {
	var context = this.canvas[0].getContext("2d");
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
				this.field.ez_w/2,
				this.field.h/2 - 5);
		} else {
			// Right side score
			context.fillText(
				score,
				this.field.w - this.field.ez_w/2,
				this.field.h/2 - 5);
		}
	} else {
		if(DEBUG == true){
			this.alert("Your device does not support text on canvas");
		}
	}
};

AndroidUiController.prototype.createTurnoverButton = function() {
        this.turnover_button = Titanium.UI.createButton({
            id:'turnover_b',
            title:'Turnover',
            color:'#000000',
            height:40,
            width:80,
            fontSize:14
        });
};

AndroidUiController.prototype.showTurnoverButton = function() {
        alert('AndroidUiController.prototype.showTurnoverButton');
//        document.getElementById('turnover_b').style.height = '40';
//        Titanium.UI.currentWindow.repaint();
};

AndroidUiController.prototype.hideTurnoverButton = function() {
        alert('AndroidUiController.prototype.hideTurnoverButton');
//        document.getElementById('turnover_b').style.height = '0';
//        Titanium.UI.currentWindow.repaint();
};

AndroidUiController.prototype.createUndoButton = function() {
        this.undo_button = Titanium.UI.createButton({
            id:'undo_b',
            title:'Undo',
            color:'#000000',
            height:40,
            width:60,
            fontSize:14
        });
};

AndroidUiController.prototype.showUndoButton = function() {
        alert('AndroidUiController.prototype.showUndoButton');
//        document.getElementById('turnover_b').style.height = '40';
//        Titanium.UI.currentWindow.repaint();
};

AndroidUiController.prototype.hideUndoButton = function() {
        alert('AndroidUiController.prototype.hideUndoButton');
//        document.getElementById('turnover_b').style.height = '0';
//        Titanium.UI.currentWindow.repaint();
};

AndroidUiController.prototype.createSubButton = function() {
        this.sub_button = Titanium.UI.createButton({
            id:'sub_b',
            title:'Sub',
            color:'#000000',
            height:40,
            width:60,
            fontSize:14
        });
};

ui_controller = AndroidUiController;