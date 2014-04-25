var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
$(document).ready(function(){

	$('#logerror').click(function(){
    	var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
    	$.post( "/bugs", {user:"fakeperson", message:bug}, function(data,status){
    	});
    });
    
    generateMenus();
    generateStatues();
    generateTimes();

    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });

    if ($("#status-ivyroom").hasClass('closed'))
	$("#ivy-room-tab").css("border-bottom", "4px solid red");
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
    $.ajax({
	url: "/menu/ratty"
    }).done(function(result) {
	var parent = $('#tab-content1 .menus');
	var split = result.split('\n');
	for (var i=0; i<split.length; i++){
	    var li ='<li>'+ split[i] + '</li>';
	    parent.append(li);
	}
    });

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
