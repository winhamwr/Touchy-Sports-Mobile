var subbingOut = null;
var subbingIn = null;
var subLastClicked = null;
var rosterChanged = true;	/* if a player is added, or injury/substitution occurs, this
							should be changed to true; true forces the dialog to be rebuilt. */
var $subDialog = null;

$(document).ready(function() {	
	/* TODO: This should be retrieved */
	subbingOut = homeTeam.playersInPlay[0].name;
});	

function initSubDialog() {
	$subDialog = $('<div></div>')
		.html('<div class="playerTable">'+
					'<table align="center" id="benchedPlayers">'+
						'<thead></thead>'+
						'<tbody></tbody>'+
				'</table></div>')
		.dialog({
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
					$(this).dialog("close");
				}
			}
		});
		if (homeTeam != null) {
			$($subDialog.find("thead")).append("<tr><th colspan=2>Who\'s going in for "+subbingOut+"?</th></tr>");
			var playersList = '';
			for (a=0;a<homeTeam.playersBenched.length;a++) {
				playersList+='<tr><td class="playerName normal">'+homeTeam.playersBenched[a].name+'</td></tr>';
			}
			$($subDialog.find("tbody")).append(playersList);
		}
		// remove the titlebar
		$subDialog.dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
		// add the click event for the players
		$($subDialog.find("td")).click(function() {
			if (subLastClicked != null) {
				$(subLastClicked).removeClass("highlighted");
				$(subLastClicked).addClass("normal");
			}
			$(this).removeClass("normal");
			$(this).addClass("highlighted");
			subLastClicked = $(this);
		});
		rosterChanged = false;
};

function showSub() {
	if (homeTeam != null) {
		if (rosterChanged) {
			initSubDialog();	/* TODO: initDialog once, then just change the dialog
								contents each time a roster change occurs? */
		} else if (subLastClicked != null) {
			$(subLastClicked).removeClass("highlighted");
			$(subLastClicked).addClass("normal");
			subLastClicked = null;
		}
		$subDialog.dialog('open');
	} else {
		alert('ERROR: showSub called, but homeTeam not set');
	}
};

function handleSubClick() {
	subbingIn = $(subLastClicked).text();
	homeTeam.sub(subbingOut, subbingIn);
	rosterChanged = true;
	subbingIn = null;
};