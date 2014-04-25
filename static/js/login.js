$(document).ready(function(){
    $.ajax({
        url: "/isLoggedIn"
    }).done(function(result) {
    	if(result === 'yes'){
    		$('#login').hide();
    		$('#logout').show();
    		$('#nav_buttons').append('Welcome! ' + name);
    	} else{
    		$('#login').show();
    		$('#logout').hide();
    	}
    });
});
