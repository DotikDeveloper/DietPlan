$(document).ready( function(){
	$(".main").removeClass("d-none");
	$('.test_start').click(function(){
		$(".main").addClass("d-none");
		$(".step:nth-child(1)").removeClass("d-none");
	});

	$('.next').click(function(){
		var position = $(".step:not(.d-none)");

		if ($(".step:not(.d-none) input").val()=='') {
			$(".step:not(.d-none) input").addClass("invalid");
			setTimeout(function(){
				$(".step:not(.d-none) input").removeClass("invalid");
			}, 3000)

		} else {
			position.addClass("d-none");
			position.next().removeClass("d-none");			
		}
	});	

	$('.prev').click(function(){
		var position = $(".step:not(.d-none)");
		position.addClass("d-none");
		position.prev().removeClass("d-none");
	});	

	$( "form" ).submit(function( e ){
		e.preventDefault();
		var mail_ch = $('#step7');
		var pattern = /.+@.+\..+/i;     
		if(mail_ch.val() != ''){
			if(mail_ch.val().search(pattern) == 0){
				sendMail();
			}else{
				error();
			}
		}else{
			error();
		}
	});

	function error() {
		$("#step7").addClass("notvalid");
		setTimeout(function(){
			$("#step7").removeClass("notvalid");
		}, 3000)
	}


	function sendMail() {
		var reason = $('input[name="step1"]:checked').prop('id');
		var weight = $('#step6').val();
		var height = $('#step5').val();
		var IMT =  Math.floor(weight/(height*height)*10000 * 100) / 100 ;
		var age = $('input[name="step3"]:checked').prop('id');
		var gender = $('input[name="step2"]:checked').prop('id');
		var lost_kal = $('input[name="step4"]:checked').prop('id');
		var rate_IMT;	
		var file2send;
		var norm_IMT_min;
		var norm_IMT_max;

		switch (true) {
			case reason == "step1_value1" || reason == "step1_value4":
			reason = "del_mass";
			break;
			case reason == "step1_value2" || reason == "step1_value3":
			reason = "add_mass";
			break;
			case reason == "step1_value5":
			reason = "pregnant";
			break;
		}

		switch (true) {
			case IMT <= 24.9:
			rate_IMT = "low_rate_IMT";
			break;
			case IMT >=25 && IMT <=29.9:
			rate_IMT = "norm_rate_IMT";
			break;
			case IMT >=30 :
			rate_IMT = "hight_rate_IMT";
			break;
		}

		switch (age) {
			case "step3_value1":
			age = "young1";
			norm_IMT_min = 19;
			norm_IMT_max = 24;
			break;
			case "step3_value2":
			age = "young2";
			norm_IMT_min = 20;
			norm_IMT_max = 25;
			break;
			case "step3_value3":
			age = "mature1";
			norm_IMT_min = 21;
			norm_IMT_max = 26;
			break;
			case "step3_value4":
			age = "mature2";
			norm_IMT_min = 22;
			norm_IMT_max = 27;
			break;	
			case "step3_value5":
			age = "elderly1";
			norm_IMT_min = 23;
			norm_IMT_max = 28;
			break;	
			case "step3_value6":
			age = "elderly2";
			norm_IMT_min = 23;
			norm_IMT_max = 28;
			break;								
		}

		switch (gender) {
			case "step2_value1":
			gender = "woman";
			break;
			case "step2_value2":
			gender = "man";
			break;
			case "step2_value3":
			gender = "not_gender";
			break;								
		}

		switch (true) {
			case lost_kal == "step4_value1" || lost_kal == "step4_value2":
			lost_kal = "small_lost_kall";
			break;
			case "step4_value3":
			lost_kal = lost_kal == "med_lost_kall";
			break;
			case lost_kal == "step4_value4" || lost_kal == "step4_value5":
			lost_kal = "high_lost_kall";
			break;							
		}	

		switch (reason) {
			case "pregnant":
			file2send = "diet_1.pdf";
			break;
			case "add_mass":
			switch (rate_IMT) {
				case "low_rate_IMT":
				file2send = "diet_2.pdf";
				break;
				case "norm_rate_IMT":
				switch (true) {
					case IMT < norm_IMT_min:
					file2send = "diet_2.pdf";
					break;
					case IMT > norm_IMT_min && IMT < norm_IMT_max:
					file2send = "diet_3.pdf";
					break;
					case IMT > norm_IMT_max:
					file2send = "diet_3.pdf";
					break;
				}
				case "hight_rate_IMT":
				file2send = "diet_3.pdf";
				break;

			}
			break;
			case "del_mass":
			switch (rate_IMT) {
				case "low_rate_IMT":
				file2send = "diet_3.pdf";
				break;
				case "norm_rate_IMT":
				switch (true) {
					case IMT < norm_IMT_min:
					file2send = "diet_3.pdf";
					break;
					case IMT > norm_IMT_min && IMT < norm_IMT_max:
					file2send = "diet_4.pdf";
					break;
					case IMT > norm_IMT_max:
					file2send = "diet_4.pdf";
					break;
				}
				case "hight_rate_IMT":
				file2send = "diet_4.pdf";
				break;

			}
			break;				
		}			


		var mail = $('#step7').val();
		formData = new FormData;
		formData.append("msg_type", "to_owner");
		formData.append("client_mail", mail);
		formData.append("file", file2send);

		console.log('Индекс '+IMT);	
		console.log('Причина '+reason);
		console.log('Вес '+weight);
		console.log('Рост '+height);
		console.log('Антропометрические данные '+rate_IMT);
		console.log('Возраст '+age);
		console.log('Пол '+gender);
		console.log('Нагрузка '+lost_kal);
		console.log('Файл для отправки '+file2send);		
		console.log('Email '+ mail);


		var form_par = $('.shmsg');
		var $that = $(this); 
		$.ajax({ 
			type: 'POST', 
			url: '../php/mail.php',
			data: formData, 
			contentType: false, 
			processData: false, 
			success: function(response){ 
				$('.shmsg').html(response);
				// form_par.append(response);
				$('.mhid').addClass('d-none');
				$('#step7').addClass('d-none');
				setTimeout(function(){
					$(".step:not(.d-none)").addClass("d-none");
					$(".main").removeClass("d-none");
				}, 2000)
			} 
		})	
		$('#step7').val('');
	}

});

