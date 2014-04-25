$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
		$(location).attr('href','/');
    });

    $('#logerror').click(function(){
    	var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
    	$.post( "/bugs", {user:"fakeperson", message:bug}, function(data,status){
    	});
    });
});
