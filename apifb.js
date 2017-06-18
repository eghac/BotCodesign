const request = require('request');
const PAGE_ACCESS_TOKEN = 'EAADn8p6PmsABAM7xuwZAeuwq6slxcpAYRy0EIFhOJ8SjOoAm6RGBimnXbXpPpyYOaLWZBbGLhb4x3MrpxV2JvUIJZCqfJrGWtdsGSxvyOdzdNkSm18qz0AzNd6U9RZASOAcCUp8GZA3XAwNOOVtFkfq1N4fQJCfkVODHqx1sDaAZDZD';

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