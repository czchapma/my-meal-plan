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

	$('#new-account').click(function(event){
		event.preventDefault();		
		$(location).attr('href', '/newaccount')
	});

	$('#login-form').submit(function(event){
		event.preventDefault();
		var serialized = $(this).serialize();
		$.ajax({
			url: "/retrieveUser",
			type: "post",
			data: serialized
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
});

