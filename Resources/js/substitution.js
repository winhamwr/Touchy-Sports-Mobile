var lastClicked = null;
var team = null;
var subbingOut = null;

$(document).ready(function() {	
	createTestData();	// make some test data to work with
	
	drawPlayerTable(team);	// draw the player table
	
	// bind the click event
	$('table td').click(function() {
		if (lastClicked != null) {
			$(lastClicked).removeClass('highlighted');
			$(lastClicked).addClass('normal');
		}
		$(this).removeClass('normal');
		$(this).addClass('highlighted');
		lastClicked = $(this);
	});
	
	// initialize the dialog
	$('#substitutionDialog').dialog({
		autoOpen: false,
		modal: true,
		width: 304,
		height: 255,
		show: 'drop',
		closeOnEscape: true,
		draggable: false,
		resizable: false,
		overlay: {
			backgroundColor: '#000',
			opacity: .5
		},
		position: [81,5],
		buttons: {
			"Sub": function() {
				handleSubClick();
				$(this).dialog("close");
			},
			"Cancel": function() {
				handleCancelClick();
				$(this).dialog("close");
			}
		}
	});
	// remove the titlebar
	$('#substitutionDialog').dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
});	

function drawPlayerTable(team) {
	if (team != null) {
		$('table thead').append('<tr><th colspan=2>Who\'s going in for '+subbingOut+'?</th></tr>');
		var playersList = '';
		for (a=0;a<team.playersBenched.length;a++) {
			playersList+='<tr><td class="playerName normal">'+team.playersBenched[a].name+'</td></tr>';
		}
		$('table tbody').append(playersList);
	};
};

function handleSubClick() {
	var subbingPlayerName = $(lastClicked).text();
	console.log('btnSub was clicked, but this is not yet finished.');
	// team.sub(team.playersInPlay[0].name,subbingPlayerName);
};

function handleCancelClick() {
	console.log('btnCancel was clicked, but this is not yet finished..');
};

function createTestData() {
	// Create our test team--this should be loaded from the game data, or at least the
	// name of the player that is being subbed and an array of the benched players.
	var playerNames = new Array('Kail','Wes','Andy','Eric','Jack','Jim','Jose',
		'Alpha','Beta','Chi','Delta','Epsilon','Gamma','Omega','Sigma','Theta','Zeta');
	var teamPlayers = new Array();
	for (i=0; i<playerNames.length; i++) {
		teamPlayers[i] = new Player(i,playerNames[i],i);
	}
	team = new Team('Stepdads','Mini Me',teamPlayers);
	subbingOut = team.playersInPlay[0].name;
};

function showSub() {
	$('#substitutionDialog').dialog('open');
};