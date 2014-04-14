var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
var hallToDescription = {'ratty' : 'The Ratty', 'vdub' : 'The VDub', 'blueroom' : 'The Blue Room', 'ivyroom': "The Ivy Room (Lunch)", 'aco': 'Andrews Commons', 'jos':"Jo's"};
$(document).ready(function(){
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
	    $('#' + entry).text(hallToDescription[entry] + ': ' + result);
	});
    });
});
