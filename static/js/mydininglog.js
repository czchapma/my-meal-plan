
$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });
    
    $('#allpurchase').click(function() {
	$('#prev-transactions').show();
	$('#left-panel').hide();
	$('#log-form').hide();
	$('#browse-items').hide();
    });
    
    $('#purchase').click(function() {
	$('#log-form').show();
	$('#left-panel').show();
	$('#prev-transactions').hide();
	$('#browse-items').hide();
    });
    
    $('#browse').click(function() {
	$('#left-panel').hide();
	$('#browse-items').show();
	$('#log-form').hide();
	$('#prev-transactions').hide();
    });

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
                check.checked = true;
                var myitem = document.getElementById(arr[i] + 'li');
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
                check.checked = true;
                var myitem = document.getElementById(arr[i] + 'li');
                cart.append(myitem);
                total.innerHTML = Number(check.getAttribute('price')) + Number(total.innerHTML);
            }
        });
    });


    $.ajax({
        url: "/itemlistjos"
    }).done(function(result) {
        var ul= $('#log-form-list-jos');
        var cart = $('#cart');
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                var check = document.createElement('input');
                li.attr('id',priceItemSplit[0] + 'li');
                check.setAttribute('class',priceItemSplit[0])
                check.setAttribute('name','check-'+ priceItemSplit[0] );
                check.setAttribute('id', priceItemSplit[0]);
                check.setAttribute('type','checkbox');
                check.setAttribute('price',priceItemSplit[1]);
                check.onchange = function somethingChanged(){
                    
                    if(this.checked)
                    {
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        cart.append(myitem);
                        total.innerHTML = Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }
                    else
                    { 
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        ul.append(myitem);
                        total.innerHTML = 0 - Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }

                    //TODO: add knapsack calls in here? or provide a button maybe
                };
                
                
                li.html(' <div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>");
                li.append(check);
                ul.append(li);
            }
        }
    });

    $.ajax({
        url: "/itemlistivy"
    }).done(function(result) {
        var ul= $('#log-form-list-ivy');
        var cart = $('#cart');
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                var check = document.createElement('input');
                li.attr('id',priceItemSplit[0] + 'li');
                check.setAttribute('class',priceItemSplit[0])
                check.setAttribute('name','check-'+ priceItemSplit[0] );
                check.setAttribute('id', priceItemSplit[0]);
                check.setAttribute('type','checkbox');
                check.setAttribute('price',priceItemSplit[1]);
                check.onchange = function somethingChanged(){
                    
                    if(this.checked)
                    {
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        cart.append(myitem);
                        total.innerHTML = Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }
                    else
                    { 
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        ul.append(myitem);
                        total.innerHTML = 0 - Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }

                    //TODO: add knapsack calls in here? or provide a button maybe
                };
                
                
                li.html(' <div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>");
                li.append(check);
                ul.append(li);
            }
        }
    });

    $.ajax({
        url: "/itemlistaco"
    }).done(function(result) {
        var ul= $('#log-form-list-aco');
        var cart = $('#cart');
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                var check = document.createElement('input');
                li.attr('id',priceItemSplit[0] + 'li');
                check.setAttribute('class',priceItemSplit[0])
                check.setAttribute('name','check-'+ priceItemSplit[0] );
                check.setAttribute('id', priceItemSplit[0]);
                check.setAttribute('type','checkbox');
                check.setAttribute('price',priceItemSplit[1]);
                check.onchange = function somethingChanged(){
                    
                    if(this.checked)
                    {
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        cart.append(myitem);
                        total.innerHTML = Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }
                    else
                    { 
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        ul.append(myitem);
                        total.innerHTML = 0 - Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }

                    //TODO: add knapsack calls in here? or provide a button maybe
                };
                
                
                li.html(' <div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>");
                li.append(check);
                ul.append(li);
            }
        }
    });

    $.ajax({
        url: "/itemlistblueroom"
    }).done(function(result) {
        var ul= $('#log-form-list-blueroom');
        var cart = $('#cart');
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                var check = document.createElement('input');
                li.attr('id',priceItemSplit[0] + 'li');
                check.setAttribute('class',priceItemSplit[0])
                check.setAttribute('name','check-'+ priceItemSplit[0] );
                check.setAttribute('id', priceItemSplit[0]);
                check.setAttribute('type','checkbox');
                check.setAttribute('price',priceItemSplit[1]);
                check.onchange = function somethingChanged(){
                    
                    if(this.checked)
                    {
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        cart.append(myitem);
                        total.innerHTML = Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }
                    else
                    { 
                        var myitem = document.getElementById(this.getAttribute('id') + 'li');
                        ul.append(myitem);
                        total.innerHTML = 0 - Number(this.getAttribute('price')) + Number(total.innerHTML);
                    }

                    //TODO: add knapsack calls in here? or provide a button maybe
                };
                
                
                li.html(' <div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>");
                li.append(check);
                ul.append(li);
            }
        }
    });

    $.ajax({
        url: "/itemlist"
    }).done(function(result) {
        //TODO: make it so people can buy more than 1 of the same item. 
        var ul = $('#browse-results').children('ul');
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                var avocados = '<img class="avocado-1" src="static/imgs/avocado.png"/><img class="avocado-2" src="static/imgs/avocado.png"/><img class="avocado-3" src="static/imgs/avocado.png"/><img class="avocado-4" src="static/imgs/avocado.png"/><img class="avocado-5" src="static/imgs/avocado.png"/>';
                li.html('<div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>" + avocados);
                li.find('.avocado-1').click(function(){
                    for(var i=2; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                        $(this).siblings('.avocado-' + i).off('mouseenter');
                        $(this).siblings('.avocado-' + i).off('mouseleave');    
                    }
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    shutdownHoverAndRate($(this));
		    
                });
                li.find('.avocado-1').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});              
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                });                 li.find('.avocado-2').click(function(){
                    for (var i=3; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                    }
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    $(this).siblings('.avocado-1').off('mouseenter');
                    $(this).siblings('.avocado-1').off('mouseleave');
                    $(this).siblings('.avocado-1').css({'opacity':1});
                    shutdownHoverAndRate($(this));
                });
                li.find('.avocado-2').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});              
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});                                  
                });                 li.find('.avocado-3').click(function(){
                    for (var i=4; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                    }
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    $(this).siblings('.avocado-2').off('mouseenter');
                    $(this).siblings('.avocado-2').off('mouseleave');
                    $(this).siblings('.avocado-2').css({'opacity':1});
                    $(this).siblings('.avocado-1').off('mouseenter');
                    $(this).siblings('.avocado-1').off('mouseleave');
                    $(this).siblings('.avocado-1').css({'opacity':1});
                    shutdownHoverAndRate($(this));
                });
                li.find('.avocado-3').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});
                    $(this).siblings('.avocado-2').css({'opacity': 1});
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});
                    $(this).siblings('.avocado-2').css({'opacity': .5});
                });                 li.find('.avocado-4').click(function(){
                    $(this).siblings('.avocado-' + 5).css({'opacity':.5});
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-3').css({'opacity':1});
                    $(this).siblings('.avocado-2').css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity':1});    
                    shutdownHoverAndRate($(this));                
                });
                li.find('.avocado-4').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});
                    $(this).siblings('.avocado-2').css({'opacity': 1});
                    $(this).siblings('.avocado-3').css({'opacity': 1});
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});
                    $(this).siblings('.avocado-2').css({'opacity': .5});
                    $(this).siblings('.avocado-3').css({'opacity': .5});
                });
                li.find('.avocado-5').click(function(){
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-4').css({'opacity':1});
                    $(this).siblings('.avocado-3').css({'opacity':1});
                    $(this).siblings('.avocado-2').css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity':1});
                    shutdownHoverAndRate($(this));                  
                });                 li.find('.avocado-5').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});
                    $(this).siblings('.avocado-2').css({'opacity': 1});
                    $(this).siblings('.avocado-3').css({'opacity': 1});
                    $(this).siblings('.avocado-4').css({'opacity': 1});
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});
                    $(this).siblings('.avocado-2').css({'opacity': .5});
                    $(this).siblings('.avocado-3').css({'opacity': .5});
                    $(this).siblings('.avocado-3').css({'opacity': .5});
                    $(this).siblings('.avocado-4').css({'opacity': .5});
                }); 
                ul.append(li);
            }
        }
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

    $('#browse-input').keyup(function(){
        $('#browse-results').children('ul').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#browse-input').val().toLowerCase();
            //if item does not start with currText, hide the li
            if (item.lastIndexOf(currText, 0) === 0) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

//Converts 650 -> $6.50
function prettyPrint(price){
    var toReturn = '$';
    var dollar = Math.floor(price / 100);
    toReturn += dollar;
    toReturn += '.';
    toReturn +=  price - (dollar * 100);
    return toReturn;
}
//curr is a jquery object of the current image
//once you click, hover effect should stop
function shutdownHoverAndRate(curr) {
    for(var i=1; i<=5; i++){
        curr.siblings('.avocado-' + i).off('mouseenter');
        curr.siblings('.avocado-' + i).off('mouseleave');
    }
    curr.off('mouseenter');
    curr.off('mouseleave');
    rate(curr);
}

function rate(curr){
    var fakeUsername = 'christine_chapman@brown.edu';
    var item = curr.siblings('.food-item').text();
    var rating = curr.attr('class')[curr.attr('class').length - 1];
    $.post( "/review", {username:fakeUsername, item: item, rating: rating}, function(data,status){
        console.log(data);
    });
}
