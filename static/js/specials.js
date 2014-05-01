var dininghalls = ['ratty','vdub', 'blueroom', 'ivyroom', 'aco', 'jos'];
var hallToDescription = {'ratty' : 'The Ratty', 'vdub' : 'The VDub', 'blueroom' : 'The Blue Room', 'ivyroom': "The Ivy Room (Lunch)", 'aco': 'Andrews Commons', 'jos':"Jo's"};

$(document).ready(function(){
    $('#suggestion').hide();

    $('#suggest').click(function(){
    	if(!loggedIn){
           	$.ajax({
                url: "/random"
            }).done(function(results) { 
            	var json = JSON.parse(JSON.stringify(results));
			    $('#suggestion').show();
			    $('#foodPicked').html(json[0]['item']);
    		});
    	} else {
    		$.post("/suggest",{numItems : 1},function(data,status){
			    var start = data.indexOf("Foods Suggested:") + "Foods Suggested:".length;
			    var word = data.substring(start);
			    var end = word.indexOf("/n");
			    word= word.substring(start,end);
			    console.log(word);
			    $('#suggestion').show();
			    $('#foodPicked').html(word);
			});
		}
    });

    dininghalls.forEach(function(entry){
    	var date = new Date();
    	if (entry !== 'ivyroom' || date.getHours() < 14){
			$.ajax({
			    url: "/specials/" + entry
			}).done(function(result) {
				var diningHall = hallToDescription[entry];
				var foods = result;
				if (entry === 'vdub'){
					var split = foods.split(' ');
					diningHall = diningHall + ' ' + split[0];
					foods = foods.replace(split[0] + ' ','');
				} 
				$('#' + entry).html("<h2>" +  diningHall + '</h2> <div class="foods"> ' + foods + "</div>");
			});
		}
    });
});
