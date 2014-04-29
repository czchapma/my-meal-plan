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
});
