
$(document).ready(function(){
	

	$('#populate').click(function(){
		$.post("/storeUser",{name: "Steven McGarty", email: "steven_mcgarty@brown.edu",
			month:"March",day:"1992",gender:"MALE",password:"*****"},function(data,status){
			console.log(data);
		});
	});

});