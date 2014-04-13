$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });
    
    $('#allpurchase').click(function() {
	$('#prev-transactions').show();
	$('#log-form').hide();
    });
    
    $('#purchase').click(function() {
	$('#log-form').show();
	$('#prev-transactions').hide();
    });
});
