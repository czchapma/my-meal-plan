var name = document.querySelector('meta[name=name]').content;
var email = document.querySelector('meta[name=email]').content;
var ratings = {};
var numNewItems = 0;
$(document).ready(function(){

    $('#logerror').click(function(){
        var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
        $.post( "/bugs", {user:email, message:bug}, function(data,status){
        });
    });
    
    //Logo redirects to home
    $('#logo').click(function(){
	$(location).attr('href','/');
    });

    if ($('#other').prop('checked') === true) {
	//if checked, show other box
	$('#otherType').show();
    } else {
	//if unchecked, hideother box
	$('#otherType').hide();
    }

    $('#other, #female, #male').change(function(){
	if ($('#other').prop('checked') === true) {
	    //if checked, show other box
	    $('#otherType').show();
	} else {
	    //if unchecked, hideother box
	    $('#otherType').hide();
	}
    });

    $('#new-account-form').submit(function(event){
        event.preventDefault();
        var formData = $(this).serialize();
        var count = 0;
        for (var item in ratings){
            count += 1;
            formData += '&item' + count + '=' + item + ratings[item];
        }
        if(count < 5 && numNewItems < 10){
            //don't submit,error out!
            $('#rate_msg').show();
        } else {
            console.log(formData);
            $.post( "/storeUser", formData, function(data,status){
                window.location = '/logpurchase';
            });
        }
    });

    $('#name').val(name);
    $('#email').val(email);

	$.ajax({
		    url: "/random5"
		}).done(function(result) {
			var ul = $('#rate');
			for (var index=0; index<5; index++){
				var json = JSON.parse(JSON.stringify(result[index]));
                var li = $(document.createElement('li'));
                var avocados = '<img class="avocado-1" src="static/imgs/avocado.png"/><img class="avocado-2" src="static/imgs/avocado.png"/><img class="avocado-3" src="static/imgs/avocado.png"/><img class="avocado-4" src="static/imgs/avocado.png"/><img class="avocado-5" src="static/imgs/avocado.png"/>';
                li.html('<div class="food-item">' + json['item'] + "</div><div class='food-price'>" + prettyPrint(json['price']) + "</div>" + avocados + "<input type=button value='X' class='remove'>");
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
                });
                li.find('.avocado-4').click(function(){
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
                });
                li.find('.avocado-5').on('mouseenter', function(){
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
                li.find('.remove').click(function(){
                    var currRem = $(this);
                    numNewItems += 1;
                    if (numNewItems >= 10){
                        $('#right-panel label').text("It seems like you haven't tried many items! You can press 'submit' and move on.");
                        $('#rate').hide();
                    }
                    $.ajax({
                        url: "/random"
                    }).done(function(resultNew) { 
                        var json2 = JSON.parse(JSON.stringify(resultNew));
                        currRem.siblings('.food-item').text(json2[0]['item']);
                        currRem.siblings('.food-price').text(prettyPrint(json2[0]['price']));
                    });
                });
                ul.append(li);
            }
		});
});

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
    var item = curr.siblings('.food-item').text();
    var rating = curr.attr('class')[curr.attr('class').length - 1];
    ratings[item] = rating;
}
