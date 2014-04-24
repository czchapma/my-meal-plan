$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });

    if ($('#other').prop('checked') === true) {
	//if checked, show other box
	$('#otherType').show();
    } else {
	//if unchecked, hideother box
	$('#otherType').hide();
    }

    $('#other, #female, #male').change(function(){
	if ($('#other').prop('checked') === true) {
	    //if checked, show other box
	    $('#otherType').show();
	} else {
	    //if unchecked, hideother box
	    $('#otherType').hide();
	}
    });

    var name = document.querySelector('meta[name=name]').content;
    $('#name').val(name);
    var email = document.querySelector('meta[name=email]').content;
    $('#email').val(email);
});
