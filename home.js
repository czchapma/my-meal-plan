$(document).ready(function(){
	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			var url = $(this).attr('id');
			$(location).attr('href', url);
		});	
	});

	//Generate Ratty menu
	$.ajax({
		url: "/rattymenu"
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
		url: "/vdubmenu"
		}).done(function(result) {
			var parent = $('#tab-content2 ul');
			var split = result.split('\n');
			for (var i=0; i<split.length; i++){
				var li ='<li>'+ split[i] + '</li>';
				parent.append(li);
			}
		});


}); 


