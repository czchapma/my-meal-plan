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

	var loginType = document.querySelector('meta[name=login-type]').content;
	if (loginType === 'failed'){
		//Invalid Login!
		$('#login-failed').text('Login Failed: Username or Password is incorrect');
	}
});

