$(document).ready(function(){
	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			$.get('/' + $(this).attr('id'));
		});	
	});
}); 


