$.post('test.php', {uid: 'BAAJ'}).done(function(data){
		//successful ajax request
		alert(data);
		return data;
	});
