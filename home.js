$(document).ready(function(){
    

	//Logo redirects to home
    $('#logo').click(function(){
		$(location).attr('href','/');
	});

	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			var url = '/' + $(this).attr('id');
			$(location).attr('href', url);
		});
	});
});
