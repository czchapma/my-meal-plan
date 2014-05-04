$(document).ready(function(){
    $.ajax({
        url: "/allpurchases"
    }).done(function(result) {
        var ul = $('#prev-transactions ul');
        ul.html('');
        curchunk = 0;
        prevdates = [];
        prevTimes = array
        prevul = null;
       /*result = [{item:"Item1", date:"Date1"},
                   {item:"Item2", date:"Date1"},
                {item:"Item1", date:"Date2"},
                {item:"Item1", date:"Date3"},
                {item:"Item3", date:"Date1"},
                {item:"Item3", date:"Date2"},
                {item:"Item2", date:"Date2"},
                {item:"Item3", date:"Date1"},
                {item:"Item2", date:"Date3"},
                {item:"Item3", date:"Date3"},
                {item:"Item4", date:"Date3"},
                {item:"Item4", date:"Date1"},
                {item:"Item5", date:"Date1"},
                {item:"Item4", date:"Date2"},
                {item:"Item5", date:"Date2"}];*/ //test data
        for (var i=0; i<result.length; i++){
            var json = JSON.parse(JSON.stringify(result[i]));

            var item = json['item'];
            var date = json['date'];
            var time = json['time'];
            var li = '<li><div class="prev-trans-item">'+ item + ': </div><div class="prev-trans-date">' + date + '</div>' + time '</li>';
            if(prevdates.indexOf(date) !== -1)
            {
                console.log(item);
                var datenospaces = date;
                while(datenospaces.indexOf(" ") !== -1)
                     datenospaces = datenospaces.replace(" ","");
                $("#" + datenospaces).append(li);
            }
            else
            {
                newul = $(document.createElement('ul'));
                var datenospaces = date;
                while(datenospaces.indexOf(" ") !== -1)
                     datenospaces = datenospaces.replace(" ","");
                newul.attr('id',datenospaces);
                prevdates.push(date);
                newul.append("<h1>" + date + "</h1>");
                newul.append(li);
                ul.append(newul); 
            }
            
        }

        if(result.length === 0){
            ul.append("<li>You haven't logged any purchases.  Click 'log a purchase' to add one</li>");
        }
    });
});