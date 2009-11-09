if(!AndroidUiController) var AndroidUiController = {};

$.extend(AndroidUiController, {

	ui	: function(canvas, field, options) {
		this._options = options;
		this._canvas = canvas;
		this._f = field; // The field dimensions

		this.init;
	}
});

AndroidUiController.ui.prototype = new BaseUiController.ui();
AndroidUiController.ui.prototype.contructor = new AndroidUiController.ui();

AndroidUiController.ui.prototype.init = function() {
    $('#player-bar > div > div').append('<button>Fred Sanford</button>');

    $('#undo_b').append('<button>Undo</button>');
    $('#turnover_b').append('<button>Turnover</button>');
    $('#sub_b').append('<button onClick="showSub()">Sub</button>');
};

AndroidUiController.ui.prototype.bindEvents = function(ultimate_canvas) {
    
//        var turnover_button = Titanium.UI.createButton({
//            id:'#turnover_b',
//            title:'Turnover',
//            color:'#ffffff',
//            height:50,
//            fontSize:20,
//            fontWeight:'bold'
//        });
//        turnover_button.addEventListener('click',function(e) {
//            ultimate_canvas.handleTurnover();
//        });

	ultimate_canvas._elem.click(function(event) {
		ultimate_canvas.handlePass(event);
	});

	var player_bar = $('#player-bar');
	player_bar.click(function(event) {
		ultimate_canvas.handlePlayerClick(event);
	});

	var turnover_b = $('#turnover_b')
	turnover_b.click(function(event) {
		ultimate_canvas.handleTurnover();
	});

        var undo_b = $('#undo_b')
	undo_b.click(function(event) {
		ultimate_canvas.handleUndo();
	});
        
//        var undo_button = Titanium.UI.createButton({
//            id:'menu-bar',
//            title:'Undo',
//            color:'#336699',
//            height:50,
//            fontSize:20
//        });
//        undo_button.addEventListener('click',function(e) {
//            alert('Undo button pressed.');
//            ultimate_canvas.handleUndo();
//        });

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
AndroidUiController.ui.prototype.alert = function(msg) {
        var myalert = Titanium.UI.createAlertDialog();
        myalert.setMessage(msg);
        myalert.setButtonNames(['OK']);
        myalert.show();
};

/*
 * Displays/updates the score for the given team, 0 for home, 1 for away.
 * Takes the team, endzone and current score of that team
 */
AndroidUiController.ui.prototype.displayScore = function(team, ez, score) {
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

ui_controller = AndroidUiController.ui;