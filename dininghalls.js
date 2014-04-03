$(document).ready(function(){
	generateMenus();
	generateStatues();
});

function generateStatues(){
	var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
	dininghalls.forEach(function(entry){
		$.ajax({
			url: "/status/" + entry
			}).done(function(result) {
				var parsed = JSON.parse(result);
				if (parsed['open'] === 'true') {
					//open
					$('#status-' + entry).attr('class','open');
					$('#status-' + entry).text(parsed['message']);
				} else{
					//closed
					$('#status-' + entry).attr('class','closed');
					$('#status-' + entry).text(parsed['message']);
				}
		});

	});
}

function generateMenus(){
	//Generate Ratty menu
	$.ajax({
		url: "/menu/ratty"
		}).done(function(result) {
			var parent = $('#tab-content1 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});

	//Generate VDub menu
	$.ajax({
		url: "/menu/vdub"
		}).done(function(result) {
			var parent = $('#tab-content2 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});

	//Generate Blue Room menu
	$.ajax({
		url: "/menu/blueroom"
		}).done(function(result) {
			var parent = $('#tab-content3 ul');
			var parsed = JSON.parse(JSON.stringify(result));
			var soups ='<li>' + parsed['soups'] + '</li>';
			var dinner ='<li>' + parsed['dinner'] + '</li>';
			parent.append(soups);
			parent.append(dinner);
			// for (var i=0; i<split.length; i++){
			// 	var li ='<li>'+ split[i] + '</li>';
			// 	parent.append(li);
			// }
		});


	//Generate Ivy Room menu
	$.ajax({
		url: "/menu/ivyroom"
		}).done(function(result) {
			var parent = $('#tab-content4 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});
	//Generate Andrews Commons menu
	$.ajax({
		url: "/menu/andrews"
		}).done(function(result) {
			var parent = $('#tab-content5 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});
	//Generate Andrews Commons menu
	$.ajax({
		url: "/menu/jos"
		}).done(function(result) {
			var parent = $('#tab-content6 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});
}