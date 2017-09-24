(function () {
    var Message;
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
    $(function () {
		var flagName=false;
		var flagEmployer=false;
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
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
		checkForEmail = function(val){
			console.log("in checkEmail");
			if (val.toLowerCase()=="charchit@google.com".toLowerCase() || val.toLowerCase()=="pratikpawar@google.com".toLowerCase() || val.toLowerCase()=="Arivou.Tandabany@team.telstra.com".toLowerCase()) {
				console.log("registered user")
				 return true;
			}
			else {
				 return false;
			}
		}
        sendMessage = function (text, from_bot) {
			console.log(text)
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
				var data=text;
				if(checkForRFID(text)){
					data="RFID "+text
					console.log(data)
				}
				if(isValidEmailAddress(text)){
					if(checkForEmail(text)){
						data="Registered"
					}
					else{
						data="Unregistered"
					}
				}
				if(flagName==true){
					data="Name "+text;
				}
				if(flagEmployer==true){
					data="Employer "+text;
				}
				$.ajax({
					url: 'http://203.92.52.116:9001/msg',
					type: 'post',
					data: data,
					success: function (data) {
						sendMessage(data, true);
						if(data=="Ohh, It seems you are not registered yet...Please enter your name"){
							flagName=true;
						}
						else if(data.indexOf("Please enter your employer's name")>=0){
							flagEmployer=true;
						}
						else{
							flagName=false;
							flagEmployer=false;
						}
					},
					error: function (data) {
						console.log("error sending the jquery post req from front end")
					}
				});
            	message_side = 'right';
            }
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
			if(from_bot === false){
				/* $.ajax({
					url: "http://services.groupkt.com/country/get/iso2code/"+text
				}).then(function(data) {
					console.log(data)
				   sendMessage(data.RestResponse.result.name, true);
				}); */
			}
			console.log("@")
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText(), false);
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText(), false);
            }
        });
        /*sendMessage('Hello Philip! :)', true);
        setTimeout(function () {
            return sendMessage('Hi Sandy! How are you?');
        }, 1000);
        return setTimeout(function () {
            return sendMessage('I\'m fine, thank you!', true);
        }, 2000);*/
    });
}.call(this));
