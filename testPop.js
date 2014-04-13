
$(document).ready(function(){
	

	$('#populate').click(function(){
		$.post("/storeUser",{name: "Steven McGarty", email: "steven_mcgarty@brown.edu",
			month:"March",year:"1992",gender:"Male",password:"*****"},function(data,status){
			console.log(data);
			$.post("/review",{username: "steven_mcgarty@brown.edu",
				item:"Chobani",rating:"4"},function(data,status){
				console.log(data);
			});
			$.post("/review",{username: "steven_mcgarty@brown.edu",
				item:"Sandwich",rating:"5"},function(data,status){
				console.log(data);
			});
		});
		// $.post("/storeUser",{name: "Christine", email: "christine_chapman@brown.edu",
		// 	month:"August",year:"1992",gender:"Female",password:"*****"},function(data,status){
		// 	console.log(data);
		// 	$.post("/review",{username: "christine_chapman@brown.edu",
		// 		item:"Sandwich",rating:"1"},function(data,status){
		// 		console.log(data);
		// 	});
		// 	$.post("/review",{username: "christine_chapman@brown.edu",
		// 		item:"Chobani",rating:"3"},function(data,status){
		// 		console.log(data);
		// 	});
		// });
		// $.post("/storeUser",{name: "Zach", email: "zolstein@cs.brown.edu",
		// 	month:"March",year:"1992",gender:"Male",password:"*****"},function(data,status){
		// 	console.log(data);
		// 	$.post("/review",{username: "zolstein@cs.brown.edu",
		// 		item:"Falafel",rating:"5"},function(data,status){
		// 		console.log(data);
		// 	});
		// 	$.post("/review",{username: "zolstein@cs.brown.edu",
		// 		item:"Tuna",rating:"3"},function(data,status){
		// 		console.log(data);
		// 	});				
		// });
		// $.post("/storeUser",{name: "Raymond", email: "raymond_zeng@brown.edu",
		// 	month:"March",year:"1992",gender:"Male",password:"*****"},function(data,status){
		// 	console.log(data);
		// 	$.post("/review",{username: "raymond_zeng@brown.edu",
		// 		item:"Chobani",rating:"5"},function(data,status){
		// 		console.log(data);
		// 	});
		// 	$.post("/review",{username: "raymond_zeng@brown.edu",
		// 		item:"Tuna",rating:"1"},function(data,status){
		// 		console.log(data);
		// 	});
		// });

	});
});