$(document).ready(function(){

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