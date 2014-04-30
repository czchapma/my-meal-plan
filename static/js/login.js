var name = document.querySelector('meta[name=name]').content;
$(document).ready(function(){
    $.ajax({
        url: "/isLoggedIn"
    }).done(function(result) {
    	if(result === 'yes'){
    		$('#login').hide();
    		$('#logout').show();
    		$('#welcomeMsg').text('Welcome! ' + name);
    	} else{
    		$('#login').show();
    		$('#logout').hide();
            $('#welcomeMsg').text('');
    	}
    });

    $('#logerror').click(function(){
        var bug = window.prompt("Report your bug here. Please include your browser and OS information.");
        $.post( "/bugs", {message:bug}, function(data,status){
        });
    });


    //secret thing
    var rand = Math.floor((Math.random()*10000)+1);
    if (rand === 2222){
        $('#nav_bar').css({'background-color':'#7fedf0'});
        $('body').css({'background-color':'#C6F2FC'});
        $('#home-content').css({'background-color':'#FFF6DB'});
        $('#nav_bar').append('<audio id="letitgo" src="letitgo.mp3" preload="auto"></audio>');   
        $('#nav_buttons a:hover').css({'background-color':'#FFF6DB'})     
        document.getElementById('letitgo').play();
        $('img').attr('src','static/imgs/frozen.jpg');
    }

    if (rand > 9500){
        $('body *').css({'background-color':'black'});
        $('body *').css({'color':'#fd9fb6'})
        $('body').css({'background-color' : 'transparent'});
        $('body').css({'background-image':'url("static/imgs/nothingtoseehere.jpeg")'});
        $('body').css({'background-size':'50%'});
        
        $('#nav_bar').css({'background-color':'black'});
        $('#nav_bar *').css({'color':'#fd9fb6'});
        $('#home-content').css({'background-color':'black'});

        $('#home-content').css({'color':'#fd9fb6'});
        $('#nav_bar').append('<audio id="meh" src="totallyuninteresting.wav" preload="auto"></audio>');   
        $('#nav_buttons a:hover').css({'background-color':'#FFF6DB'})     
        document.getElementById('meh').play();
        //$('img').attr('src','static/imgs/nothingtoseehere.jpg');
    }
});
