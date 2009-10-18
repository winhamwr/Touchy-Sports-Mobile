;(function($) {

$.fn.ultimateCanvas = function(options) {
	var canvas = this[0];

	var TOTAL_WIDTH = 480;
	var FIELD_HEIGHT = 276;
	var ENDZONE_WIDTH = 80;
	var FIELD_WIDTH = TOTAL_WIDTH - ENDZONE_WIDTH*2;
	var INNER_FIELD_WIDTH = TOTAL_WIDTH - ENDZONE_WIDTH * 2;
	var HASH_HEIGHT = FIELD_HEIGHT / 3;
	var HASH_WIDTH = FIELD_WIDTH / 4;

	var HOME_TEAM = 0;
	var AWAY_TEAM = 1;

	var SCORE_LIMIT = 7;

	var clicks = [];
	var clickCount = 0;
	var possession = HOME_TEAM;

	var home_score = 0;
	var away_score = 0;

	init_game();

	function init_game() {
		clicks = [];
		clickCount = 0;
		possession = HOME_TEAM;

		home_score = 0;
		away_score = 0;

		draw();
	}

	function draw(){
		drawField();
		drawScore();
		drawPasses();
	}

	function drawScore(){
		var context = canvas.getContext("2d");
		context.font = "bold 12px sans-serif";

		context.strokeStyle = "#FFFF00";	// yellow

		// Home score
		context.fillText(home_score, ENDZONE_WIDTH/2, FIELD_HEIGHT/2);

		// Away score
		context.fillText(away_score, TOTAL_WIDTH - ENDZONE_WIDTH/2, FIELD_HEIGHT/2);
	}

	function setDirArrow(canvas) {
		var context = canvas.getContext("2d");

		context.strokeStyle = "#FF00FF";
		context.beginPath();
		// Draw the cross-field line
		context.moveTo(2*ENDZONE_WIDTH, FIELD_HEIGHT/2);
		context.lineTo(4*ENDZONE_WIDTH, FIELD_HEIGHT/2);

		if(possession == HOME_TEAM) {
			context.lineTo(4*ENDZONE_WIDTH - 30, FIELD_HEIGHT/2 - 30);
			context.moveTo(4*ENDZONE_WIDTH, FIELD_HEIGHT/2);
			context.lineTo(4*ENDZONE_WIDTH - 30, FIELD_HEIGHT/2 + 30);
		} else {
			context.moveTo(2*ENDZONE_WIDTH, FIELD_HEIGHT/2);
			context.lineTo(2*ENDZONE_WIDTH + 30, FIELD_HEIGHT/2 - 30);
			context.moveTo(2*ENDZONE_WIDTH, FIELD_HEIGHT/2);
			context.lineTo(2*ENDZONE_WIDTH + 30, FIELD_HEIGHT/2 + 30);
		}

		context.stroke();
	}



	function drawField() {
		drawFieldRects(canvas);
		drawFieldHorizontalLines(canvas);
		drawFieldVerticalLines(canvas);
		setDirArrow(canvas);
	}

	function drawFieldRects(canvas) {
		var context = canvas.getContext("2d");
		// endzone rectangles
		context.fillStyle = "#3300FF";	// blue 25,70,25
		context.strokeStyle = "#000000";
		context.fillRect(0,0,ENDZONE_WIDTH,FIELD_HEIGHT);
		context.strokeRect(0,0,ENDZONE_WIDTH,FIELD_HEIGHT);
		context.fillRect(ENDZONE_WIDTH + INNER_FIELD_WIDTH,0,ENDZONE_WIDTH,FIELD_HEIGHT);
		context.strokeRect(ENDZONE_WIDTH + INNER_FIELD_WIDTH,0,ENDZONE_WIDTH,FIELD_HEIGHT);
		// field rectangle
		context.fillStyle = "#33FF00"; // green
		context.fillRect(ENDZONE_WIDTH,0,INNER_FIELD_WIDTH,FIELD_HEIGHT)
		context.strokeRect(ENDZONE_WIDTH,0,INNER_FIELD_WIDTH,FIELD_HEIGHT)
	}

	function drawFieldVerticalLines(canvas) {
		var context = canvas.getContext("2d");
		context.strokeStyle = "#FFFFFF";
		context.beginPath();
		context.moveTo(0,HASH_HEIGHT);
		context.lineTo(TOTAL_WIDTH,HASH_HEIGHT);
		context.moveTo(0,HASH_HEIGHT*2);
		context.lineTo(TOTAL_WIDTH,HASH_HEIGHT*2);
		context.stroke();
	}

	function drawFieldHorizontalLines(canvas) {
		var context = canvas.getContext("2d");
		context.strokeStyle = "#FFFFFF";
		context.beginPath();
		context.moveTo(ENDZONE_WIDTH+HASH_WIDTH,0);
		context.lineTo(ENDZONE_WIDTH+HASH_WIDTH,FIELD_HEIGHT);
		context.moveTo(ENDZONE_WIDTH+HASH_WIDTH*2,0);
		context.lineTo(ENDZONE_WIDTH+HASH_WIDTH*2,FIELD_HEIGHT);
		context.moveTo(ENDZONE_WIDTH+HASH_WIDTH*3,0);
		context.lineTo(ENDZONE_WIDTH+HASH_WIDTH*3,FIELD_HEIGHT);
		context.stroke();
	}

	function drawPass(from, to) {
		if(to == null){
			return null;
		}

		var context = canvas.getContext("2d");
		context.strokeStyle = "#FFFF00";	// yellow
		context.fillStyle = "#FFFF00";	// yellow
		context.beginPath();
		context.moveTo(from.x,from.y);
		context.lineTo(to.x,to.y);
		context.stroke();

		drawPoint(to);
	}

	function drawPoint(point){
		var context = canvas.getContext("2d");
		context.strokeStyle = "#FFFF00";	// yellow
		context.fillStyle = "#FFFF00";	// yellow

		// Draw a circle at the point
		context.beginPath();
		var radius         = 7;                    // Arc radius
		var startAngle     = 0;                     // Starting point on circle
		var endAngle       = Math.PI+(Math.PI*2)/2; // End point on circle

		context.arc(point.x, point.y, radius, startAngle, endAngle, false);
		context.fill();
		context.stroke();
	}

	function drawPasses(){
		if(clickCount == 0){
			return null;
		}
		// Loop through the last 3 clicks and draw them
		for(i = 3; i >= 0; i--){ // Start 3 clicks ago
			if(clickCount - i >= 0){
				// We have a click
				var curClick = clicks[clickCount-i];
				if(clickCount - i - 1 >= 0){
					// There's a click before the curClick
					var prevClick = clicks[clickCount-i-1];
					drawPass(prevClick, curClick);
				}else{
					// This is the last/only click
					drawPoint(curClick);
				}
			}
		}
	}

	var field = $("#field");
	field.click(function(event) {
		clickCount++;
		var newClick = {"x":event.clientX,"y":event.clientY};
		if(passIsScore(newClick, possession)){
			return handleScore(possession);
		}
		clicks[clickCount-1] = newClick;
		draw();
		getPlayer();
	});

	function getPlayer() {
		$('#player-bar > div > div').removeClass('inactive');
		$('#player-bar > div > div').addClass('active');
	}

	function handlePlayerClick(event) {
		$('#player-bar > div > div').removeClass('active');
		$('#player-bar > div > div').addClass('inactive');
	}

	var player_bar = $('#player-bar');
	player_bar.click(handlePlayerClick);

	/**
	 * Determine if a pass click is a score.
	 */
	function passIsScore(click, possession){
		if(possession == HOME_TEAM){
			if(click.x >= ENDZONE_WIDTH + INNER_FIELD_WIDTH){
				return true;
			}
		}else{
			if(click.x <= ENDZONE_WIDTH){
				return true;
			}
		}

		return false;
	}

	function handleScore(posession){
		if(possession == HOME_TEAM){
			home_score++;
			possession = AWAY_TEAM;
			var score = home_score;
		}else{
			away_score++;
			possession = HOME_TEAM;
			var score = away_score;
		}
		alert("omg. You scored!. You've got "+score+" points!");
		if(score >= SCORE_LIMIT){
			alert("Whoa. You totally scored enough points to make you the winner!");
			return init_game();
		}
		clicks = [];
		clickCount = 0;
		draw();
	}
};

})(jQuery);

