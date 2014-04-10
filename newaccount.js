$(document).ready(function(){
	//Logo redirects to home
	$('#logo').click(function(){
		$(location).attr('href','/');
	});

	//Other menu items work
	$('a').each(function(){
		$(this).click(function(event){
			event.preventDefault();
			var url = '/' + $(this).attr('id');
			$(location).attr('href', url);
		});
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
});