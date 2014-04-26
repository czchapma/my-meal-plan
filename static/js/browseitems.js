$(document).ready(function(){
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

                if(priceItemSplit.length === 3){
                    //show stored rating
                    console.log(priceItemSplit[2]);
                    $('.avocado-' + priceItemSplit[2]).last().trigger('click');
                }
            }
        }
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
