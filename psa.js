const PAGE_ACCESS_TOKEN = 'EAANsh9OhAE8BAPQ71PjeOK1ZAJhZBjP44ZBy6l4Tg3mb9K8DZA2rlT8pg0sPJdjyB2ZBDjSkbLUiMbi3AeiZBG7aqUf3VK8GoZBEZCuDoSxjWMHTgZBCvJWqkJ721xUTVc9qo35uSQU0U3xZA6tPDUHsG2aUQfWgZCEWsgbP1ZAgZCqTKkQZDZD';
const request = require('request');
var apiFb = require('./apifb');

function sendPsaButtonTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: psaInfo(),
					buttons: [buttonTemplate("Leer más..","http://www.uagrm.edu.bo/formas/adm/files/2017_05_22_08_30_04.html")]
				}
			}
		}
	}
	apiFb.callSendAPI(messageData)	
}

function psaInfo() {
	return'PROCEDIMIENTO\nPASO 1: Pago\nPago de matrícula en entidades financieras con Carnet de Identidad original vigente.\n\nPASO 2: Test Psicotécnico y Preinscripción\nLLENAR CON LOS DATOS CORRESPONDIENTES EN EL FORMULARIO DE PREINSCRIPCIÓN E IMPRIMIR, página web: www.uagrm.edu.bo\n\nPASO 3: Inscripción\nPersonalmente debe entregar los requisitos según el calendario de inscripción en la Sala de Cómputo del Depto. Admisión Estudiantil,  Pabellón 145, Campus Universitario...'
}

function buttonTemplate(title,url) {
	return {
		type: "web_url",
		title: title,
		url: url
	}
}



exports.sendPsaButtonTemplate = sendPsaButtonTemplate;