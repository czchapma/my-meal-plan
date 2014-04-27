var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
var hallToDescription = {'ratty' : 'The Ratty', 'vdub' : 'The VDub', 'blueroom' : 'The Blue Room', 'ivyroom': "The Ivy Room (Lunch)", 'aco': 'Andrews Commons', 'jos':"Jo's"};
$(document).ready(function(){

	$('#logerror').click(function(){
    	var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
    	$.post( "/bugs", {user:"fakeperson", message:bug}, function(data,status){
    	});
    });
    //Logo redirects to home

    $('#suggestion').hide();
    $('#logo').click(function(){
	$(location).attr('href','/');
    });


    
    $('#suggest').click(function(){
	$.post("/suggest",{username: "steven_mcgarty@brown.edu",numItems : 1},function(data,status){
	    var start = data.indexOf("Foods Suggested:") + "Foods Suggested:".length;

	    var word = data.substring(start);
	    var end = word.indexOf("/n");
	    word= word.substring(start,end);
	    console.log(word);
	    $('#suggestion').show();
	    $('#foodPicked').html(word);
	    
	});
    });

    dininghalls.forEach(function(entry){
	$.ajax({
	    url: "/specials/" + entry
	}).done(function(result) {
	    $('#' + entry).html("<h2>" +  hallToDescription[entry] + '</h2> <div class="foods"> ' + result + "</div>");
	});
    });
});
