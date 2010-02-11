$(document).ready(function() {

    var tm = new TeamManager();
    var teams = tm.getNumTeams();

    var appendStartGame = '<p><a href="game_setup.html">Start Game</a></p>'
    if(teams == 0) {
        appendStartGame = '<p><a href="create_team.html">Start Game</a></p>';
    }
	$('div').append('<h1>Touchy Sports&trade; Mobile</h1></br></br>'+
                    appendStartGame +
					'<p><a href="create_team.html">Create Team</a></p>'+
					'<p><a href="data.html">Manage Data</a></p>'+
					'<p><a href="about.html">About</a></p>');
});