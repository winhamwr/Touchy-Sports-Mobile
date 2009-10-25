$(document).ready(function() {
	Titanium.UI.addEventListener('tabchange',function(e)
	{
		Titanium.API.info('>>>>>>>>>>>>>>>>>>>>>>>>>> TABCHANGE index ' + e.index  + ' name ' + e.name + ' prevIndex ' + e.prevIndex + ' prevName ' + e.prevName);
	});

	// data for tableview
	var data = [
		{title:'Test Field View', hasChild:true},
		{title:'Test Players View', hasChild:true},
		{title:'About', hasChild:true}
	];

	// tableview object
	var tableView = Titanium.UI.createTableView({
		data:data,
		title:'Main',
	}, function(eventObject) 
	{
		// handle tableview click events
		var idx = eventObject.index;
		switch(idx)
		{
			case 0:
			{
				var win = Titanium.UI.createWindow({
					url:'field.html',
					name:'field',
					backgroundColor:'#3300CC',
					fullscreen:true,
					orientation:'landscape'
				});
				win.open({animated:true});
				break;
			}
			case 1:
			{
				var win = Titanium.UI.createWindow({
					url:'players.html',
					title:'Players View Test'
				});
				win.open({animated:true});
				break;
			}
			case 2:
			{
				var win = Titanium.UI.createWindow({
					url:'about.html',
					title:'About'
				});
				win.setBarColor('#000000');
				win.open({animated:true});
				break;
			}
		}
	});
	Titanium.UI.currentWindow.addView(tableView);
	Titanium.UI.currentWindow.showView(tableView);
});