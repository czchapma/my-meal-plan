$(document).ready(function(){
	var $form = $('#track-credits-form')
	var $credits = $('#credits');
	var $points = $('#points');
	var $creditsErr = $('#creditsErr');
	var $pointsErr = $('#pointsErr');

	$creditsErr.hide();
	$pointsErr.hide();

	$credits.keyup(function(){
		if (isInt($credits.val())) {
			$creditsErr.hide();
		} else{
			$creditsErr.show();
		}
	});

	$points.keyup(function(){
		if (isFloat($points.val())) {
			$pointsErr.hide();
		} else{
			$pointsErr.show();
		}
	});

	$form.submit(function(event){
		event.preventDefault();
		//Only submit if data validates
		if (isFloat($points.val()) && isInt($credits.val())) {
			var serialized = $form.serialize();
			$.ajax({
			url: "/trackCredits",
			type: "post",
			data: serialized
			}).done(function(result) {
				var parsed = JSON.parse(result);
	        	$('#creditsLeft').text('Credits left per day: ' + parsed['credits']);
	        	$('#pointsLeft').text('Points left per day: ' + parsed['points']);
			});
		}
	});
});

//from: http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
function isFloat(n) {
	return !isNaN(n);
}

function isInt(n) {
	var intRegex = /^\d+$/;
	return (intRegex.test(n));
}