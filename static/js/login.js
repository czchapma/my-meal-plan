var name = document.querySelector('meta[name=name]').content;
var email = document.querySelector('meta[name=email]').content;
$(document).ready(function(){
    $.ajax({
        url: "/isLoggedIn"
    }).done(function(result) {
    	if(result === 'yes'){
    		$('#login').hide();
    		$('#logout').show();
    		$('#welcomeMsg').text('Welcome! ' + name);
    	} else{
    		$('#login').show();
    		$('#logout').hide();
            $('#welcomeMsg').text('');
    	}
    });
});
