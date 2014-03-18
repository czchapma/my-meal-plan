$(document).ready(function(){
	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			var request = new XMLHttpRequest();	
			request.open('GET', '/' + $(this).attr('id'));
			request.send();
		});	
	});
}); 


