$(document).ready(function(){

	$.ajax({
        url: "/bugData"
    }).done(function(result) {
    	var ul = $('#bugs');
    	console.log(result);
    	var len = result.length;
    	for(var i = 0; i < len; i++)
    	{

    		var li = $(document.createElement('li'));
    		console.log(li);
    		console.log(ul);
    		li.html("<strong>" + result[i].user + "</strong> " + result[i].message + " " + result[i].time);
    		ul.append(li);
    	}
    });

    $.ajax({
        url: "/flavorData"
    }).done(function(result) {
    	var ul = $('#flavors');
    	console.log(result);
    	var len = result.length;
    	for(var i = 0; i < len; i++)
    	{

    		var li = $(document.createElement('li'));
    		console.log(li);
    		console.log(ul);
    		li.html("<strong>" + result[i].user + "</strong> " + result[i].item + " " + result[i].flavor);
    		ul.append(li);
    	}
    });
});