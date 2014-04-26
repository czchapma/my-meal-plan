$(document).ready(function(){
    $.ajax({
        url: "/allpurchases"
    }).done(function(result) {
        var ul = $('#prev-transactions ul');
        ul.html('');
        for (var i=0; i<result.length; i++){
            var json = JSON.parse(JSON.stringify(result[i]));
            var li = '<li><div class="prev-trans-item">'+ json['item'] + '</div><div class="prev-trans-date">' + json['date'] + '</div></li>';
            ul.append(li);
        }

        if(result.length === 0){
            ul.append("<li>You haven't logged any purchases.  Click 'log a purchase' to add one</li>");
        }
    });
});