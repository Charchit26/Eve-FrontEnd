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
				$.ajax({
					url: 'http://203.92.52.116:9001/msg',
					type: 'post',
					data: data,
					success: function (data) {
						sendMessage(data, true);
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
