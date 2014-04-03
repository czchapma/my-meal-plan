$(document).ready(function(){
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
			console.log(result);
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
});