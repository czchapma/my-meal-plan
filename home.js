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
		}).done(function(result) { console.log(result);});
}); 


