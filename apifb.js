const request = require('request');
const PAGE_ACCESS_TOKEN = 'EAANsh9OhAE8BAPQ71PjeOK1ZAJhZBjP44ZBy6l4Tg3mb9K8DZA2rlT8pg0sPJdjyB2ZBDjSkbLUiMbi3AeiZBG7aqUf3VK8GoZBEZCuDoSxjWMHTgZBCvJWqkJ721xUTVc9qo35uSQU0U3xZA6tPDUHsG2aUQfWgZCEWsgbP1ZAgZCqTKkQZDZD';

function callSendAPI (messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages?access_token='+ PAGE_ACCESS_TOKEN,
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Mensaje enviado con éxito desde apifb.js!")
			var recipientID = body.recipient_id;
			var messageID = body.message_id;
		} else {
			console.log("No fué posible enviar el mensaje!")
		}
	});
}

exports.callSendAPI = callSendAPI;