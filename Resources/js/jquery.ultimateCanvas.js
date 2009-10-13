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

	var clicks = [];
	var clickCount = 0;

	var score = 0;

	drawField();

	function drawField() {
		drawFieldRects(canvas);
		drawFieldHorizontalLines(canvas);
		drawFieldVerticalLines(canvas);
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

	function drawPass(from,to) {
		var context = canvas.getContext("2d");
		context.strokeStyle = "#FFFF00";	// yellow
		context.fillStyle = "#FFFF00";	// yellow
		context.beginPath();
		context.moveTo(from.x,from.y);
		context.lineTo(to.x,to.y);
		context.stroke();

		// Draw a circle at the end point
		context.beginPath();
		var radius         = 7;                    // Arc radius
		var startAngle     = 0;                     // Starting point on circle
		var endAngle       = Math.PI+(Math.PI*2)/2; // End point on circle

		context.arc(to.x,to.y,radius,startAngle,endAngle, false);
		context.fill();
		context.stroke();
	}

	function drawPasses(){
		for(i = 1; i <4; i++){
			if(clickCount - i >= 0){
				var prevClick = clicks[clickCount-i];
				var curClick = clicks[clickCount-i+1];
				drawPass(prevClick, curClick);
			}
		}
	}

	var field = $("#field");
	field.click(function(event) {
		drawField();
		var newClick = {"x":event.clientX,"y":event.clientY};
		if(passIsScore(newClick, true)){
			return handleScore();
		}
		clicks[clickCount] = newClick;
		drawPasses();
		clickCount++;
	});

	/**
	 * Determine if a pass click is a score.
	 */
	function passIsScore(click, ltr){
		if(ltr){
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

	function handleScore(){
		score++;
		alert("omg. You scored!. You've got "+score+" points!");
		clicks = [];
		clickCount = 0;
	}
};

})(jQuery);

