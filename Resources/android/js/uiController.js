function AndroidUiController(canvas) {
	this.canvas = canvas;
}

mixin(AndroidUiController.prototype, uiControlling);

AndroidUiController.prototype.init = function() {
	this.WIDTH_OFFSET = 0;
	this.HEIGHT_OFFSET = 0;

	// Initialize the field
	this.initField();

//    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
	$('#sub_b').append('<button>Sub</button>');
};

AndroidUiController.prototype.getTotalHeight = function() {
        return 290;
};

AndroidUiController.prototype.getTotalWidth = function() {
        return 480;
};


AndroidUiController.prototype.bindEvents = function(ultimate_canvas) {

//        var turnover_button = Titanium.UI.createButton({
//            id:'#turnover_b',
//            title:'Turnover',
//            color:'#ffffff',
//            height:50,
//            fontSize:20,}
//
//            fontWeight:'bold'
//        });
//        turnover_button.addEventListener('click',function(e) {
//            ultimate_canvas.handleTurnover();
//        });

	ultimate_canvas.canvas.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	for (var i=1;i<8;i++) {
		var playerButton = $('#player-button-'+i);
		playerButton.click(function() {
			ultimate_canvas.handlePlayerClick($(this));
		});
	}

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		ultimate_canvas.handleTurnover();
	});

//	var undo_b = $('#undo_b')
//	undo_b.click(function(event) {
//		ultimate_canvas.handleUndo();
//	});

	var sub_b = $('#sub_b')
	sub_b.click(function(event) {
		ultimate_canvas.handleSub();
	});

        var undo_button = Titanium.UI.createButton({
            id:'undo_b',
            title:'Undo',
            color:'#336699',
            height:30,
            width:50,
            fontSize:14
        });
        undo_button.addEventListener('click',function(e) {
            alert('Undo button pressed.');
            ultimate_canvas.handleUndo();
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

/*
 * 
 */
AndroidUiController.prototype.hideUndoButton = function() {

};

/*
 *
 */
AndroidUiController.prototype.showUndoButton = function() {

};

ui_controller = AndroidUiController;