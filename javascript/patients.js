$(document).ready(function(){
	
	var p_info_template = Tempo.prepare("info");
	var dialog_template = Tempo.prepare("dialog");
	var presc_info_template = Tempo.prepare("presc_info");
	var p_id;
	var presc_id;
	var stop_item;
	var stop_item_id;
	var u_id = readCookie("uid");;
	
	/**
	 * Catch all input and filter the list
	 */
	$('.filterinput').keyup(function () {
		filterList($(this), $('#p_lookup'));
	});
	
	/**
	 * Convert dialog div into dialog and hide it
	 * This dialog is a confirmation dialog to stop meds
	 */
	$('#dialog').dialog({
		autoOpen: false,
		width: 'auto',
		buttons: {
			"Yes": function() {
				data = {"reason":$('#stop_reason').val()};
				if(stop_item=="med")path="/voorschriften/stop/ad_presc_id/";
				if(stop_item=="npsy"){
					path="/nonPsycho/stop";
					data["nonPsychoPatId"] = stop_item_id;
				}
					
				callWebservice(data, path+stop_item_id, function(){
					//Reload the patient_info
					showInfo(p_id);
				});
				$(this).dialog("close");
			},
			Cancel: function(){
				$(this).dialog("close");
			}
		}
	});
	
	/**
	 * Convert dialog div into dialog and hide it
	 * This dialog is a confirmation dialog to stop meds
	 */
	$('#error_dialog').dialog({
		autoOpen: false,
		width: 'auto',
		buttons: {
			"OK": function() {
				$(this).dialog("close");
			}
		}
	});
	
	/**
	 * Convert dialog div into dialog and hide it
	 * This dialog is a confirmation dialog to stop meds
	 */
	$('#req_perm_dialog').dialog({
		autoOpen: false,
		width: 'auto',
		buttons: {
			"Toestemming vragen": function() {
				//ask for permission -> create notification
				data = {
						"user_id":u_id,
						"patient_id":p_id,
						"reason":$('#notif_reason').val()
				};
				callWebservice(data, "/notifications/create", function(data){
					var result = $.parseJSON(data);
					//Show the patient list
					hidePages();
					$("#lookup").show();
				});
				$(this).dialog("close");
			},
			Cancel: function(){
				$(this).dialog("close");
				//Show the patient list
				hidePages();
				$("#lookup").show();
			}
		}
	});
	$('.datepicker').datepicker({ autoSize: true, dateFormat: 'yy-mm-dd' });
	
	$('.pat_add').click(function(ev){
		hidePages();
		$('#pat_add').show();
	});

	/**
	 * Get the list of patients from the backend
	 */
	callWebservice("","/patienten",function(data){
		var patients = $.parseJSON(data);
		//Render the list of patients
		Tempo.prepare("p_lookup").render(patients.allPatients);
	});
	
	/**
	 * Show all information about a patient
	 * p_id: the id of the patient.
	 */
	function showInfo(p_id){
		//check if the user can see this patient, otherwise show dialog to ask permission
		var data = {"patient_id":p_id};
		callWebservice(data,"/users/check",function(data){
			var result = $.parseJSON(data);
			if(result){
				callWebservice("","/patienten/show/patient_id/"+p_id,function(data){
					var p_info = $.parseJSON(data);
					
					//Create new objects to add new prescriptions and non-psychofarmaca
					p_info.patient[0].prescriptions.push({"id":"new","med":{"name":"Nieuw..."}});
					p_info.patient[0].non_psycho.push({"id":"new","name":"Nieuw..."});
					
					//Render the page with all the info
					p_info_template.notify(function(event){
						if(event.type == TempoEvent.Types.RENDER_COMPLETE){
							//remove the delete icon for the last row (adding a new item)
							$('[name|="new"]').parent('li').find('a:nth-child(2)').hide();
							$('[name|="new"]').parent('li').find('.patient_start').hide();
							//activate the accordion
							$('#accordion').accordion({ fillSpace: true, active: 1, collapsible: true });
						}
					}).render(p_info.patient);
					//Show the info page of the patient
					$("#info").show();
				});
			}else{
				$('#req_perm_dialog').dialog('open');
			}
		});
	}
	
	$('.p_item').live('click',function(){
		//Hide the other pages
		$("#lookup").hide();
		//retrieve patient info
		p_id = $(this).find('span').attr('id');
		showInfo(p_id);
	});
	
	//bind the delete function to the icon
	$('.del').live('click',function(){
		//save the prescription id
		stop_item_id = $(this).attr('name');
		//check if it's a prescription or a med that's being stopped
		stop_item = ($(this).siblings('a').hasClass('med'))?"med":"npsy";
		//find the text of the item that has to be stopped
		var del = {"stop_item":$(this).parents('li').find('a:first').text()};
		
		//render the dialog
		dialog_template.notify(function(event){
			if(event.type == TempoEvent.Types.RENDER_COMPLETE){
				//open the dialog when rendered
				$('#dialog').dialog('open');
			}
		}).render(del);
	});
	
	$('#btn_add_patient').click(function(){
		processForm($(this), function(data){
			var patient = $.parseJSON(data);
			hidePages();
			showInfo(patient.patient[0].personalInfo.id);
		});
	});
	
	$('.presc').live('click',function(){
		if($(this).attr('name').indexOf("new") == -1){
			hidePages();
			//get the prescription id
			var pr_id = $(this).attr('name');
			
			//get info about the prescription
			callWebservice("","/voorschriften/show/ad_presc_id/"+pr_id,function(data){
				var pr_info = $.parseJSON(data);
				
				//Render the page with all the info
				presc_info_template.notify(function(event){
					if(event.type == TempoEvent.Types.RENDER_COMPLETE){
						$("#presc_info table tr td").each(function(){
							if($(this).text() == "")
								$(this).parents("tr").hide();
						});
					}
				}).render(pr_info.prescription);
				//Show the info page of the patient
				$('#presc_info').show();
			});
		}
	});
	
	//Navigate to the forms to add a prescription or a non-psychofarmacum
	$('a[name="new"]').live('click',function(){
		hidePages();
		var type = $(this).attr('class');
		if(type.indexOf("presc") != -1)
			$('#presc_add').show();
		else if(type.indexOf("npsy") != -1){
			callWebservice("","/nonPsycho",function(data){
				var nonpsys = $.parseJSON(data);
				var result = TrimPath.processDOMTemplate("nonpsy_template", nonpsys);
				$("#non_psychos").html(result);
			});
			$('#npsy_add').show();
		}
	});
	
	$('#btn_presc_add').click(function(){
		processForm($(this),function(data){
			if(!data){
				return false;
			}else{
				//check if the insert was successful
				var result = $.parseJSON(data);
				//show the patient info
				hidePages();
				showInfo(p_id);
			}
		});
	});
	
	$('#btn_nonpsy_add').click(function(){
		processForm($(this),function(data){
			if(!data)
				return false;
			else{
				//check if the insert was successful
				var result = $.parseJSON(data);
				//show the patient info
				hidePages();
				showInfo(p_id);
			}
		});
	});
	
	//if there's a patient_id, show the add_prescription for this patient
	p_id = $.QueryString("p_id");
	if(p_id){
		hidePages();
		$('#presc_add').show();
		//put the patient id in the form (hidden)
		$('#presc_add input[name="patientId"]').attr('value', p_id);
		//get the medication id
		var m_id = $.QueryString("m_id").replace('#','');
		//get the name of the medicine for the m_id
		callWebservice("","/medicijnbeheer/getmedname/medFormId/"+m_id,function(data){
			if(data !== "ERROR"){
				var m_info = $.parseJSON(data);
				//Show the name of the med in the form and put the id in the value
				$('#presc_add input[name="medName"]').val(m_info.medicine.name);
				$('#presc_add input[name="medFormId"]').val(m_id);
				$('#poss_doses').text("Mogelijke dosissen: " + m_info.medicine.dose);
			}else{
				$('#error_dialog').dialog('open');
			}
		});
	}
	
	$('#presc_s_med').click(function(){
		window.location = 'meds.html?p_id='+$('#accordion').find('table').attr('id');
	});
});