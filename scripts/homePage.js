// A $( document ).ready() block.
$( document ).ready(function() {
	var user ={"rfid":"", "name":"","email":"","orgName":""}
	flagName=false;
	flagEmployer=false;
	updateUser=false;
    $('.send_message').click(function (e) {
		return sendMessage(getMessageText(), false);
		//add focus
	});
	$('.message_input').keyup(function (e) {
		if (e.which === 13) {
			return sendMessage(getMessageText(), false);
		}
		
	});

	sendMessage = function (text, from_bot) {
				showMessageDialog(text, from_bot);
				console.log(text)
				var rfidFlag = false;
				var emailFlag = false;
				var $messages, message;
				if (text.trim() === '') {
					return;
				}
				$('.message_input').val('');
				$messages = $('.messages');
				//message_side = message_side === 'left' ? 'right' : 'left';
				if(from_bot === true){
					message_side = 'left';
				}
				else{
					message_side = 'right';
					var statement=text;
					rfidFlag=checkForRFID(text);
					emailFlag=isValidEmailAddress(text);
					if(checkForRFID(text)){
						statement="RFID "+text
						console.log(statement)
						user.rfid=text;
					}
					if(isValidEmailAddress(text)){
						checkForEmail(text);
					}else{
						getBotResponse(statement, message_side);					
					}
				}
			}
	showMessageDialog = function(text, message_side){
		
		$messages = $('.messages');
		message = new Message({
					text: text,
					message_side: message_side
				});
		message.draw();
		return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
	}
	
	getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
    };
	
	checkForRFID = function(val){
		console.log("in check");
		var a = val;
		var filter = /^\d{10}$/;
		if (filter.test(a)) {
			console.log("true")
			 return true;
		}
		else {
			 return false;
		}
	}
	function isValidEmailAddress(emailAddress) {
		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		return pattern.test(emailAddress);
	};
	checkForEmail = function(email){
		console.log("in checkEmail "+email);
		
		$.ajax({
				//url: 'http://203.92.52.116:9001/msg',
				url: 'http://localhost:8888/api/user/email',
				type: 'post',
				data: email,
				success: function (data) {
					console.log("ret data -->"+data);
					if(data==null || data=="" || data==" "){
						getBotResponse("Unregistered", message_side);
						user.email=email;				
					}else{
						console.log(data)
						getBotResponse("Registered", message_side);
						user.email=email;
						user.name=data.name;
						user.orgName=data.orgName;
						updateUserDetails(user);
					}					
				},
				error: function (data) {
					console.log("error sending the jquery post req from front end")
					return false;
				}
			});
			//setTimeout(function(){console.log("Time out over")}, 3000)
	}
	
	Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
	getBotResponse = function(statement, message_side){
		if(flagName && !flagEmployer){
			user.name=statement;
			statement="Name "+statement;
		}
		if(flagEmployer){
			user.orgName=statement;
			statement="Employer "+statement;
			updateUser=true;
		}
		$.ajax({
			//url: 'http://203.92.52.116:9001/msg',
			url: 'http://localhost:8080/msg',
			type: 'post',
			data: statement,
			success: function (data) {
				if(data=="Ohh, It seems you are not registered yet...Please enter your name"){
					flagName=true;
					showMessageDialog(data, message_side);
				}
				else if(data.indexOf("Please enter your employer's name")>=0){
					flagEmployer=true;
					showMessageDialog(data, message_side);
				}
				else{
					showMessageDialog(data, message_side);
					//flagName=false;
					flagEmployer=false;
				}
				if(updateUser){
					createUserDetails(user);
				}			
				
			},
			error: function (data) {
				console.log("error sending the jquery post req from front end")
			}
		});
	}
	createUserDetails = function(user){
		$.ajax({
			url: 'http://localhost:8888/api/user/',
			type: 'post',
			data: JSON.stringify(user),
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function (data) {
				console.log("user saved"+data);				
			},
			error: function (data) {
				console.log("error sending the jquery post req from front end")
			}
		});
		flagName=false;
		flagEmployer=false;
		updateUser=false;
		var user ={"rfid":"", "name":"","email":"","orgName":""}		
	}
	updateUserDetails = function(user){
		$.ajax({
			url: 'http://localhost:8888/api/user/rfid',
			type: 'post',
			data: JSON.stringify(user),
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function (data) {
				console.log("user saved"+data);				
			},
			error: function (data) {
				console.log("error sending the jquery post req from front end")
			}
		});
		flagName=false;
		flagEmployer=false;
		updateUser=false;
		var user ={"rfid":"", "name":"","email":"","orgName":""}	
	}
});
