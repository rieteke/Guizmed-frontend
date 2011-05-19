$(document).ready(function(){
	$('#unlockField').dontType();
	$('#pin').dontType();
	//$('#unlockF').dontType();
	
	/**
	 * Convert dialog div into dialog and hide it
	 */
	$('#dialog').dialog({
		autoOpen: false,
		width: 'auto',
		modal: true,
		buttons: {
			"Ok": function() { 
				$(this).dialog("close"); 
			} 
		}
	});
	
	/**
	 * Process the login form
	 */
	$(".button").click(function(){
		processForm($(this), function(data){
			if(!data){
				//show error message
				$('#dialog').dialog('open');
			}else{
				//get the token out of the data if the login was successful
				var data = $.parseJSON(data);
				var token = data.message.inlog;
				if(token != "Failed"){
					//save the token in a cookie for 2 hours and set a timeout timer for 20 minutes.
					createCookie("tk",token, 2*60);
					createCookie("uid",data.message.userId, 2*60);
					createCookie("to","timeout",5);
					//TODO: check if registration is complete
					//if the registration is not complete, show the first login screen.
					//$('#first_login').show();
					
					//else redirect to the main page
					window.location = "main.html";
				}else{
					//show error message
					$('#dialog').dialog('open');
				}
			}
		});
	});
	
	$('#unlock_submit').bind('click',function(e){
		var unlockcode = $(document.getElementById('unlockField')).val();
		processForm($(this),function(data){
			//if successful unlock, send through to main
			var check = $.parseJSON(data);
			if(data == "ERROR" || !check.message.login){
				$('#dialog').dialog('open');
			}else{
				window.location = "main.html";
			}
		});
		e.preventDefault();
	});
	
	//Check the querystring for unlock vs login
	if($.QueryString("p")=="ul"){
		hidePages();
		$('#unlock').show();
	}
	
	$('#btn_register').click(function(){
		//check if conf and new password are the same
		if($('#new_pass').val() == $('#conf_pass').val()){
			processForm($(this),function(data){
				//check if successful
				var result = $.parseJSON(data); 
				//if successful registration, send through to main.html
				if(result)
					window.location = "main.html";
				else{
					//show error message
					$('#dialog').dialog('open');
				}
			});
		}
	});
});