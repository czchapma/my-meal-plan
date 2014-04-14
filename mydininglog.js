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


    $.ajax({
        url: "/itemlist"
     }).done(function(result) {
        var ul = $('#log-form-list');
        console.log(result);
        var lineSplit = result.split('\n');
        for (var i=0; i<lineSplit.length; i++){
            if (lineSplit[i].indexOf(',') > -1){
                var priceItemSplit = lineSplit[i].split(',');
                var li = $(document.createElement('li'));
                console.log('<div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + priceItemSplit[1] + "</div>");
                li.html('<div class="food-item">' + priceItemSplit[0] + "</div><div class='food-price'>" + priceItemSplit[1] + "</div>");
                ul.append(li);
            }
        }
    });

     $('#log-input').keyup(function(){
        $('#log-form-list').children('li').each(function(){
            var item = $(this).children('.food-item').text().toLowerCase();
            var currText = $('#log-input').val().toLowerCase();
            //if item does not start with currText, hide the li
            console.log('item',item,'currText',currText);
            if (item.lastIndexOf(currText, 0) === 0) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
     });
});
