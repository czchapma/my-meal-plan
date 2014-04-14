$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });
    
    $('#allpurchase').click(function() {
	$('#prev-transactions').show();
	$('#log-form').hide();
	$('#browse-items').hide();
    });
    
    $('#purchase').click(function() {
	$('#log-form').show();
	$('#prev-transactions').hide();
	$('#browse-items').hide();
    });
    
    $('#browse').click(function() {
	$('#browse-items').show();
	$('#log-form').hide();
	$('#prev-transactions').hide();
    });
});
