var subbingOut = null;
var subbingIn = null;
var subLastClicked = null;
var rosterChanged = true;	/* if a player is added, or injury/substitution occurs, this
							should be changed to true; true forces the dialog to be rebuilt. */
var subUi = null;
var $subDialog = null;
var notCancelled = false;

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
			close: function() {
				catchCancel();
			},
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

function showSub(canvas, playerName) {
	console.log('showSub playerName = ', playerName);
	if (homeTeam != null) {
		if (rosterChanged) {
			initSubDialog();	/* TODO: initDialog once, then just change the dialog
								contents each time a roster change occurs? */
		} else if (subLastClicked != null) {
			$(subLastClicked).removeClass("highlighted");
			$(subLastClicked).addClass("normal");
			subLastClicked = null;
		}
		subUi = canvas;
		if (subUi != null) {
			if (playerName != null) {
				notCancelled = false;
				subbingOut = playerName;
				$($subDialog.find("th")).html("Who\'s going in for "+subbingOut+"?");
				$subDialog.dialog('open');
			} else {
				alert('ERROR: showSub called, but playerName is null');
			}
		} else {
			alert('ERROR: showSub called, but canvas is null');
		}
	} else {
		alert('ERROR: showSub called, but homeTeam not set');
	}
};

function handleSubClick() {
	notCancelled = true;
	subbingIn = $(subLastClicked).text();
	//console.log(subbingOut, ' is leaving and new to the game is ', subbingIn);
	//console.log(homeTeam.playersInPlay, '\n\n', homeTeam.playersBenched);
	homeTeam.sub(subbingOut, subbingIn);
	//console.log(homeTeam.playersInPlay, '\n\n', homeTeam.playersBenched);
	rosterChanged = true;
	subbingIn = null;
	subUi.handleSubCommit();
};

/*  this is called because hitting the Escape key closes the dialog,
	but does not call the same code as the Cancel button 			 */
function catchCancel() {
	if (!notCancelled) {
		subUi.handleSubCancel();
	}
};