var subbingOut = null;
var subbingIn = null;
var subLastClicked = null;
var subUi = null;


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