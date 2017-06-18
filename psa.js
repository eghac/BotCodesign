const request = require('request');
var apiFb = require('./apifb');

function sendAdmitidosPsaButtonTemplate(recipientID) {
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: admitidosInfo(),
					buttons: [buttonTemplate("Leer más..","http://uagrm.edu.bo/unid_adm/registro/files/2015_07_14_16_56_45.html")]
				}
			}
		}
	}
	apiFb.callSendAPI(messageData)
}

function admitidosInfo() {
	return "ESTUDIANTES NUEVOS (QUE FUERON ADMITIDOS A LA U.A.G.R.M.)\n\n-Deben seguir 6 pasos que se detallan a continuación.\nNota.- Si presenta algún bloqueo debe revisar su perfil académico en la sección Bloqueos.\nEn Leer más obtendrás más detalles.";
}

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
exports.sendAdmitidosPsaButtonTemplate = sendAdmitidosPsaButtonTemplate;