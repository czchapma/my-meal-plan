var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });

    if ($("#status-ivyroom").hasClass('closed'))
	$("#ivy-room-tab").css("border-bottom", "4px solid red");

	$('#ratty_breakfast_link').click(function(){
		$('#ratty_breakfast').show();
		$('#ratty_lunch').hide();
		$('#ratty_dinner').hide();
		$('#dining_buttons a').css({'background-color':'#7309AA', 'color':'white'});
		$(this).css({'color':'#7309AA', 'background-color':'white'});
	});
	$('#ratty_lunch_link').click(function(){
		$('#ratty_breakfast').hide();
		$('#ratty_lunch').show();
		$('#ratty_dinner').hide();
		$('#dining_buttons a').css({'background-color':'#7309AA', 'color':'white'});
		$(this).css({'color':'#7309AA', 'background-color':'white'});

	});
	$('#ratty_dinner_link').click(function(){
		$('#ratty_breakfast').hide();
		$('#ratty_lunch').hide();
		$('#ratty_dinner').show();
		$('#dining_buttons a').css({'background-color':'#7309AA', 'color':'white'});
		$(this).css({'color':'#7309AA', 'background-color':'white'});

	});

	generateMenus();
    generateStatues();
    generateTimes();
});

function generateStatues(){
    dininghalls.forEach(function(entry){
	$.ajax({
	    url: "/status/" + entry
	}).done(function(result) {
	    var parsed = JSON.parse(result);
	    if (parsed['open'] === 'true') {
		//open
		$('#status-' + entry).attr('class','open');
		$('#status-' + entry).text(parsed['message']);	
		$('#'+ entry + '-tab').css('border-bottom', '4px solid green');

	    } else{
		//closed
		$('#status-' + entry).attr('class','closed');
		$('#status-' + entry).text(parsed['message']);
		$('#'+ entry + '-tab').css('border-bottom', '4px solid red');
	    }
	});
    });
}

function generateTimes(){
    dininghalls.forEach(function(entry){
	$.ajax({
	    url: "/times/" + entry
	}).done(function(result) {
	    var parent = $('#status-' + entry).next('.times');
	    var split = result.split('\n');
	    for (var i=0; i<split.length; i++){
		var li ='<li>'+ split[i] + '</li>';
		parent.append(li);
	    }
	});
    });
}

function generateMenus(){
    //Generate Ratty menu
    generateRatty();

    //Generate VDub menu
    $.ajax({
	url: "/menu/vdub"
    }).done(function(result) {
	var parent = $('#tab-content2 .menus');
	var split = result.split('\n');
	for (var i=0; i<split.length; i++){
	    var li ='<li>'+ split[i] + '</li>';
	    parent.append(li);
	}
    });

    //Generate Blue Room menu
    $.ajax({
	url: "/menu/blueroom"
    }).done(function(result) {
	var parent = $('#tab-content3 .menus');
	var parsed = JSON.parse(JSON.stringify(result));
	var soups ='<li>' + parsed['soups'] + '</li>';
	var dinner ='<li>' + parsed['dinner'] + '</li>';
	parent.append(soups);
	parent.append(dinner);
	// for (var i=0; i<split.length; i++){
	// 	var li ='<li>'+ split[i] + '</li>';
	// 	parent.append(li);
	// }
    });


    //Generate Ivy Room menu
    $.ajax({
	url: "/menu/ivyroom"
    }).done(function(result) {
	var parent = $('#tab-content4 .menus');
	var split = result.split('\n');
	for (var i=0; i<split.length; i++){
	    var li ='<li>'+ split[i] + '</li>';
	    parent.append(li);
	}
    });
    //Generate Andrews Commons menu
    $.ajax({
	url: "/menu/andrews"
    }).done(function(result) {
	var parent = $('#tab-content5 .menus');
	var split = result.split('\n');
	for (var i=0; i<split.length; i++){
	    var li ='<li>'+ split[i] + '</li>';
	    parent.append(li);
	}
    });
    //Generate Andrews Commons menu
    $.ajax({
	url: "/menu/jos"
    }).done(function(result) {
	var parent = $('#tab-content6 .menus');
	var split = result.split('\n');
	for (var i=0; i<split.length; i++){
	    var li ='<li>'+ split[i] + '</li>';
	    parent.append(li);
	}
    });
}
function generateRatty(){
    var meals = ['breakfast','lunch','dinner'];
    for (var mealId=0; mealId<meals.length; mealId++){
    	$.post( "/menu/ratty", {meal:meals[mealId]}, function(data,status){
    		if (data === ''){
				generateRatty();
				return;
			}
    		var split = data.split('\n');
    		var meal = split[0];
			var parent = $('#tab-content1 #ratty_' + meal);
			for (var i=1; i<split.length; i++){
			    var li ='<li>'+ split[i] + '</li>';
			    parent.append(li);
			}
    	});
   		var date = new Date();
		if (date.getHours() < 11 || date.getHours() > 20){
			$('#ratty_breakfast_link').trigger('click');
		} else if (date.getHours() < 16){
			$('#ratty_lunch_link').trigger('click');
		} else {
			$('#ratty_dinner_link').trigger('click');
		}
    }
}
