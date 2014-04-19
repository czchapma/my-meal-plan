
$(document).ready(function(){
    //Logo redirects to home
    $('#logo').click(function(){
		$(location).attr('href','/');
    });
    
    $('#allpurchase').click(function() {
		$('#prev-transactions').show();
		$('#log-form').hide();
		$('#browse-items').hide();
    });
    
    $('#purchase').click(function() {
		$('#log-form').show();
		$('#prev-transactions').hide();
		$('#browse-items').hide();
    });
    
    $('#browse').click(function() {
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
        $.post( "/knapsack", {maxMoney:money }, function(data,status){
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
    console.log(knapsack);

    knapsack2.addEventListener('click', function() {
        console.log("CLicked");
        var cart = $('#cart');
        var money = (680 + 680 - Number(total.innerHTML));
        $.post( "/knapsack", {maxMoney:money }, function(data,status){
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
        url: "/itemlist"
     }).done(function(result) {
        var ul = $('#log-form-list');
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
                var avocados = '<img class="avocado-1" src="templates/imgs/avocado.png"/><img class="avocado-2" src="templates/imgs/avocado.png"/><img class="avocado-3" src="templates/imgs/avocado.png"/><img class="avocado-4" src="templates/imgs/avocado.png"/><img class="avocado-5" src="templates/imgs/avocado.png"/>'
                $('.avocado-1').click(function(){
                    for(var i=2; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                        $(this).siblings('.avocado-' + i).on('mouseenter');
                        $(this).siblings('.avocado-' + i).on('mouseleave');                        
                    }
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
    
                });
                $('.avocado-1').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});              
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                });

                $('.avocado-2').click(function(){
                    for (var i=3; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                        $(this).siblings('.avocado-' + i).on('mouseenter');
                        $(this).siblings('.avocado-' + i).on('mouseleave');
                    }
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    $(this).siblings('.avocado-1').off('mouseenter');
                    $(this).siblings('.avocado-1').off('mouseleave');
                    $(this).siblings('.avocado-1').css({'opacity':1});
                });
                $('.avocado-2').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});              
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});                                  
                });

                $('.avocado-3').click(function(){
                    for (var i=4; i<=5; i++){
                        $(this).siblings('.avocado-' + i).css({'opacity':.5});
                        $(this).siblings('.avocado-' + i).on('mouseenter');
                        $(this).siblings('.avocado-' + i).on('mouseleave');                        
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
                });
                $('.avocado-3').on('mouseenter', function(){
                    //Hover in
                    $(this).css({'opacity':1});
                    $(this).siblings('.avocado-1').css({'opacity': 1});
                    $(this).siblings('.avocado-2').css({'opacity': 1});
                }).on('mouseleave', function(){
                    //Hover out
                    $(this).css({'opacity':.5});
                    $(this).siblings('.avocado-1').css({'opacity': .5});
                    $(this).siblings('.avocado-2').css({'opacity': .5});
                });

                $('.avocado-4').click(function(){
                    $(this).siblings('.avocado-' + 5).css({'opacity':.5});
                    $(this).siblings('.avocado-' + 5).on('mouseenter');
                    $(this).siblings('.avocado-' + 5).on('mouseleave');                        
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    $(this).siblings('.avocado-3').off('mouseenter');
                    $(this).siblings('.avocado-3').off('mouseleave');
                    $(this).siblings('.avocado-3').css({'opacity':1});
                    $(this).siblings('.avocado-2').off('mouseenter');
                    $(this).siblings('.avocado-2').off('mouseleave');
                    $(this).siblings('.avocado-2').css({'opacity':1});
                    $(this).siblings('.avocado-1').off('mouseenter');
                    $(this).siblings('.avocado-1').off('mouseleave');
                    $(this).siblings('.avocado-1').css({'opacity':1});                    
                });
                $('.avocado-4').on('mouseenter', function(){
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
                $('.avocado-5').click(function(){
                    $(this).css({'opacity':1});
                    $(this).off('mouseenter');
                    $(this).off('mouseleave');
                    $(this).siblings('.avocado-4').off('mouseenter');
                    $(this).siblings('.avocado-4').off('mouseleave');
                    $(this).siblings('.avocado-4').css({'opacity':1});
                    $(this).siblings('.avocado-3').off('mouseenter');
                    $(this).siblings('.avocado-3').off('mouseleave');
                    $(this).siblings('.avocado-3').css({'opacity':1});
                    $(this).siblings('.avocado-2').off('mouseenter');
                    $(this).siblings('.avocado-2').off('mouseleave');
                    $(this).siblings('.avocado-2').css({'opacity':1});
                    $(this).siblings('.avocado-1').off('mouseenter');
                    $(this).siblings('.avocado-1').off('mouseleave');
                    $(this).siblings('.avocado-1').css({'opacity':1});                    
                });

                $('.avocado-5').on('mouseenter', function(){
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
                li.html('<div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + prettyPrint(priceItemSplit[1]) + "</div>" + avocados);
                ul.append(li);
            }
        }
    });


     $('#log-input').keyup(function(){
        $('#log-form-list').children('li').each(function(){
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
            console.log('item',item,'currText',currText);
            if (item.lastIndexOf(currText, 0) === 0) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
     });

    $('.avocado-1').click(function(){
        console.log('hello');
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
