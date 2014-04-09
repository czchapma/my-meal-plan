$(document).ready(function(){
	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			var url = '/' + $(this).attr('id');
			$(location).attr('href', url);
		});
	});

	$('#new-account').click(function(event){
		event.preventDefault();		
		$(location).attr('href', '/newaccount')
	});
});