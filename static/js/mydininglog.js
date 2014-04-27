$(document).ready(function(){

    $('#logerror').click(function(){
        var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
        $.post( "/bugs", {user:"fakeperson", message:bug}, function(data,status){
        });
    });
    $('#missing-food-form').hide();
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });

    $('#somethingmissing').click(function(){
        $('#missing-food-form').show();
        $('#somethingmissing').hide();
    });
    
    // $('#allpurchase').click(function() {
    //     $('#prev-transactions').show();
    // 	$('#left-panel').hide();
    // 	$('#log-form').hide();
    // 	$('#browse-items').hide();
    //     loadPurchases();
    // });
    
 //    $('#purchase').click(function() {
	// $('#log-form').show();
	// $('#left-panel').show();
	// $('#prev-transactions').hide();
	// $('#browse-items').hide();
 //    });
    
 //    $('#browse').click(function() {
	// $('#left-panel').hide();
	// $('#browse-items').show();
	// $('#log-form').hide();
	// $('#prev-transactions').hide();
 //    });

    $('#credits_and_points').click(function(){
    	$(location).attr('href', '/mydining');
    });

    var total = document.getElementById('total');
    var knapsack = document.getElementById('knapsack');
    var knapsack2 = document.getElementById('knapsack2');

    console.log(knapsack);
    knapsack.addEventListener('click', function() {
        console.log("CLicked");
        var cart = $('#cart');
        var money = (680 - Number(total.innerHTML));
        var tab3 = document.getElementById('tab3');
        var tab4 = document.getElementById('tab4');
        var tab5 = document.getElementById('tab5');
        var tab6 = document.getElementById('tab6');
        var myhall = "";
        if(tab3.checked)
            myhall= "blueroom"
        if(tab4.checked)
            myhall = "ivy"
        if(tab5.checked)
            myhall = "aco"
        if(tab6.checked)
            myhall = "jos"
        
        console.log(myhall);

        $.post( "/knapsack", {maxMoney:money, hall:myhall}, function(data,status){
            //TODO: make it so people can buy more than 1 of the same item. 
            var arr = data.split('\n');
            for (var i =0; i < arr.length - 1; i ++)
            {
                var check = document.getElementById(arr[i]);
                var myitem = document.getElementById(arr[i] + 'li');
		$(check).attr('in-cart', 'false');
                myitem.setAttribute('style','');
                cart.append(myitem);
                total.innerHTML = Number(check.getAttribute('price')) + Number(total.innerHTML);
            }
        });
    });
    console.log(knapsack);

    knapsack2.addEventListener('click', function() {
        console.log("CLicked");
        var cart = $('#cart');
        var money = (680 + 680 - Number(total.innerHTML));
        var tab3 = document.getElementById('tab3');
        var tab4 = document.getElementById('tab4');
        var tab5 = document.getElementById('tab5');
        var tab6 = document.getElementById('tab6');
        var myhall = "";
        if(tab3.checked)
            myhall= "blueroom"
        if(tab4.checked)
            myhall = "ivy"
        if(tab5.checked)
            myhall = "aco"
        if(tab6.checked)
            myhall = "jos"
        
        console.log(myhall);
        $.post( "/knapsack", {maxMoney:money, hall:myhall}, function(data,status){
            //TODO: make it so people can buy more than 1 of the same item. 
            var arr = data.split('\n');
            for (var i =0; i < arr.length - 1; i ++)
            {
                var check = document.getElementById(arr[i]);
                $(check).attr('in-cart', 'true');
		var myitem = document.getElementById(arr[i] + 'li');
                cart.append(myitem);
                total.innerHTML = Number(check.getAttribute('price')) + Number(total.innerHTML);
            }
        });
    });
    $('#log-form').submit(function(event){
        event.preventDefault();
        var items = [];
        $('#cart .food-item').each(function(idx){
            items[idx] = $(this).text();
        });
        console.log(items);
        for(var i=0; i<items.length; i++){
            $.post( "/logpurchase", {item: items[i]}, function(data,status){
                window.location = '/prevtransactions';
            });            
        }
    });

    $('#missing-food-form').submit(function(event){
        $('#missing-error').html("");
        event.preventDefault();
        var food = $("#item").val();

        if(food === "")
        {
             $('#missing-error').html($('#missing-error').html() + "Please give a food name \n");

        }
        var pricedollar = Number($('#pricedollar').val());
        var pricecents = Number($('#pricecents').val());

        if(parseInt(pricecents) !== pricecents || pricecents < 0 || pricecents >= 100)
             $('#missing-error').html($('#missing-error').html() +  "Cents should be a whole number between 0 and 100 \n");

        if(parseInt(pricedollar) !== pricedollar || pricedollar < 0)
            $('#missing-error').html($('#missing-error').html() + "Dollars should be a whole number \n");

        var blueroom= document.getElementById('blueroom');
        var ivy = document.getElementById('ivy');
        var aco = document.getElementById('aco');
        var jos = document.getElementById('jos');
        var myhall = "";
        if(blueroom.checked)
            myhall= "blueroom";
        if(ivy.checked)
            myhall = "ivy";
        if(aco.checked)
            myhall = "aco";
        if(jos.checked)
            myhall = "jos";

        if(myhall === "")
            $('#missing-error').html($('#missing-error').html() + "Please pick a dining hall \n");
        console.log($('#missing-error'));
        console.log(food);
        console.log(pricedollar);
        console.log(pricecents);
        console.log(myhall);
        if( $('#missing-error').html() === "")
        {
            $('#missing-food-form').hide();
            $('#somethingmissing').show();

             $.post( "/missing", {food:food, price:parseInt(100*(pricedollar + .01 * pricecents)), location:myhall}, function(data,status){
                alert("Thank you! Your post will await moderation.");
             });
        }

    });

    $.ajax({
        url: "/itemlistjos"
    }).done(function(result) {
	makeListOfItems('jos', result);   
    });

    $.ajax({
        url: "/itemlistivy"
    }).done(function(result) {
	makeListOfItems('ivy', result);   
    });

    $.ajax({
        url: "/itemlistaco"
    }).done(function(result) {
	makeListOfItems('aco', result);
    });

    $.ajax({
        url: "/itemlistblueroom"
    }).done(function(result) {
	makeListOfItems('blueroom', result);
    });

    $('#log-input').keyup(function(){
        $('#log-form-list-jos').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#log-input').val().toLowerCase();
            //only show items with words that start with currText
            if ((item.lastIndexOf(currText, 0) === 0) || item.indexOf(' ' + currText) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $('#log-form-list-aco').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#log-input').val().toLowerCase();
            //only show items with words that start with currText
            if ((item.lastIndexOf(currText, 0) === 0) || item.indexOf(' ' + currText) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $('#log-form-list-blueroom').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#log-input').val().toLowerCase();
            //only show items with words that start with currText
            if ((item.lastIndexOf(currText, 0) === 0) || item.indexOf(' ' + currText) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        $('#log-form-list-ivy').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#log-input').val().toLowerCase();
            //only show items with words that start with currText
            if ((item.lastIndexOf(currText, 0) === 0) || item.indexOf(' ' + currText) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

    });
});

// the same code you had for the callbacks for /itemlist<eatery>
function makeListOfItems(eatery, result) {
    var ul= $('#log-form-list-' + eatery);
    var cart = $('#cart');
    var lineSplit = result.split('\n');
    for (var i=0; i<lineSplit.length; i++){
        if (lineSplit[i].indexOf(',') > -1){
            var priceItemSplit = lineSplit[i].split(',');
            var li = $(document.createElement('li'));
            var check = document.createElement('item');
            li.attr('id',priceItemSplit[0] + 'li');
            check.setAttribute('class',priceItemSplit[0])
            check.setAttribute('name','check-'+ priceItemSplit[0] );
            check.setAttribute('id', priceItemSplit[0]);
            check.setAttribute('price',priceItemSplit[1]);
	    check.setAttribute('in-cart', 'false');
	    $(li).click(function() {
		var input = $(this).children('item');
		if (input.attr('in-cart') == 'true') {
                    var myitem = document.getElementById(input.attr('id') + 'li');
                    ul.append(myitem);
                    total.innerHTML = 0 - Number(input.attr('price')) + Number(total.innerHTML);
		    input.attr('in-cart', 'false');
		} else {
                    var myitem = document.getElementById(input.attr('id') + 'li');
                    cart.append(myitem);
                    total.innerHTML = Number(input.attr('price')) + Number(total.innerHTML);
		    input.attr('in-cart', 'true');
		}
	    });
	        var reportitem = $(document.createElement('button'));
            reportitem.attr('id',priceItemSplit[0] + "button");
            reportitem.html("Add a flavor/type");
            reportitem.click(function(){
                var flavor = window.prompt("Enter the flavor or type")
                console.log("REPORTING ITEM" + this.id.substring(0, this.id.length - 6));
                $.post("/flavor", {item: this.id.substring(0, this.id.length - 6), user:"fakeperson", flavor: flavor}, function(){});
            });

            li.html(' <div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>");
            li.append(check);
            li.append(reportitem);
            ul.append(li);
        }
    }
}

//Converts 650 -> $6.50
function prettyPrint(price){
    var toReturn = '$';
    var dollar = Math.floor(price / 100);
    toReturn += dollar;
    toReturn += '.';
    toReturn +=  price - (dollar * 100);
    return toReturn;
}
