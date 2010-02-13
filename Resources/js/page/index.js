$(document).ready(function(){
	initManageData();
});

///
///	manage_data
///

/**
 *	Builds the manage_data page (div id: manage_data).
 */
function initManageData() {
	var $games = $('#manage_data_games');
	var $db = new db_controller();
	var game_ids = $db.getStoredGames();
	var used_ids = [];
	
	$games.html();	// clear the games
	
	$.each(game_ids, function(i, val){
		if($.inArray(val, used_ids) != -1){
			return;
		}
		used_ids.push(val);

		$db.continueGame(val);
		var game = $db._getGameData();
		var game_str = JSON.stringify(game);
		$games.append('<p><strong>'+val+'</strong></p>');
		$games.append('<li><textarea placeholder="Textarea" id="game_'+val+'">'+game_str+'</textarea></li>');
	});

	$('#reset_game').click(function(event){
		$db.startNewGame();
	});
	$('#reset_all').click(function(event){
		localStorage.clear();
	});
};