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
    		li.attr("id",i);
    		console.log(li.id);
    		var approve = $(document.createElement('button'));
    		var deny = $(document.createElement('button'));
    		console.log(li);
    		console.log(ul);
    		li.html("<strong>" + result[i].user + "</strong> " + result[i].item + " " + result[i].flavor);
    		approve.html("Approve <div class='food'>" + result[i].item + "</div> <div class='flavor'>" + result[i].flavor + "</div> <div class='i'>" + i + "</div>");
    		deny.html("Deny <div class='food'>" + result[i].item + "</div> <div class='flavor'>" + result[i].flavor + "</div> <div class='i'>" + i + "</div>");

    		approve.click(function(){
    			var foodclass = this.getElementsByClassName("food");
    			var flavorclass = this.getElementsByClassName("flavor");
    			var iclass = this.getElementsByClassName("i");
    			
    			console.log("#" +  iclass[0].innerHTML);
    			var myli = document.getElementById(iclass[0].innerHTML);
    			console.log(myli);
    			$(myli).hide();
    			$.post("/approve",{item: foodclass[0].innerHTML, flavor: flavorclass[0].innerHTML}, function(){

    			})
    		});

    		deny.click(function(){
    			var foodclass = this.getElementsByClassName("food");
    			var flavorclass = this.getElementsByClassName("flavor");
    			var iclass = this.getElementsByClassName("i");
    			
    			console.log("#" +  iclass[0].innerHTML);
    			var myli = document.getElementById(iclass[0].innerHTML);
    			console.log(myli);
    			$(myli).hide();
    			$.post("/deny",{item: foodclass[0].innerHTML, flavor: flavorclass[0].innerHTML}, function(){

    			})
    		});
    		li.append(approve);
    		li.append(deny);
    		ul.append(li);
    	}
    });
});