const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var psa = require('./psa');

const PAGE_ACCESS_TOKEN = 'EAADn8p6PmsABAM7xuwZAeuwq6slxcpAYRy0EIFhOJ8SjOoAm6RGBimnXbXpPpyYOaLWZBbGLhb4x3MrpxV2JvUIJZCqfJrGWtdsGSxvyOdzdNkSm18qz0AzNd6U9RZASOAcCUp8GZA3XAwNOOVtFkfq1N4fQJCfkVODHqx1sDaAZDZD';
 
var app = express()

app.use(bodyParser.json())

var PORT = process.env.PORT || 3012;
app.listen(PORT,function(){
	console.log('Server listen localhost:3010')
})

app.get('/',function(req,res){
	res.send('Abriendo el puerto desde mi pc local con ngrok')
})

app.get('/webhook',function(req,res){
	if (req.query['hub.verify_token']=== 'emp_token') {
		console.log("Validación correcta!")
		res.send(req.query['hub.challenge'])
		//res.status(200).send(req.query['hub.challenge'])
	}else {
		//res.send('No tenés que estar aquí.')
		console.error("Validación fallida.");
    	res.sendStatus(403);  
	}	
})

app.post('/webhook',function(req,res){
	var message = '';
	var data = req.body
	if (data.object == 'page') {
		//Iterando todas las entradas Entry
		data.entry.forEach(function(pageEntry){
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;
			//Iterando cada mensaje
			pageEntry.messaging.forEach(function(messagingEvent){
				if (messagingEvent.message) {					
					getMessage(messagingEvent)

				}else {
					if (messagingEvent.postback && messagingEvent.postback.payload) {
						var senderID = messagingEvent.sender.id;
						
						switch(messagingEvent.postback.payload) {
							case 'GET_STARTED_PAYLOAD':
								sendTextMessage(senderID,"¡Genial! Tengo información lista para ti.");
								sendStartButtonTemplate(senderID);
							break;
							case 'CLICK_INFO':
								sendTextMessage(senderID,'Hola, Eliot G. Soy Fit, el Bot de la Ficct. Gracias por ponerte en contacto con nosotros en Messenger.'+
		' Tengo información lista para ti, por favor responde este mensaje con la palabra relacionada a la información '+
		'que deseas obtener.\nRETIRO o PSA o MALLA o BANCO o CAMBIO DE CARRERA');
							break;
							case 'CLICK_MALLA':
								sendTextMessage(senderID,"Mallas curriculares de la FICCT:")						
								sendMallaTemplate(senderID)
								sendTextMessageAyuda(senderID)								
							break;
							case 'CLICK_IMG_MALLA_INF':								
								sendMessageImage(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563107/malla_informatica_jexiff.jpg');
								sendTextMessageAyuda(senderID);
							break;	
							case 'CLICK_IMG_MALLA_SIS':
								sendMessageImage(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563037/malla_sistemas_euqjvn.jpg');
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_IMG_MALLA_RED':
								sendMessageImage(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563041/malla_redes_dpzos0.jpg')
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_PDF_MALLA_INF':								
								sendMessageFile(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563120/TripticoINF_nyhb6m.pdf');
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_PDF_MALLA_SIS':
								sendMessageFile(senderID,'https://res.cloudinary.com/dwxz1lnfb/image/upload/v1497738328/TripticoSIS_el6uo7.pdf');
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_PDF_MALLA_RED':
								sendMessageFile(senderID,'https://res.cloudinary.com/dwxz1lnfb/image/upload/v1497564473/TripticoRED_lblvgv.pdf');
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_VER_MAS':
								sendMenuTemplate(senderID);
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_IMG_MAPA':
								sendTextMessage(senderID,"Mapa de la UAGRM.")
								sendMessageImage(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497726810/mapa_uagrm_ekdfpw.jpg')
								sendTextMessageAyuda(senderID)
							break;
							case 'CLICK_PSA':
								sendPsaButtonTemplate(senderID);
								sendTextMessageAyuda(senderID)
							break;
							case 'CLICK_CALENDARIO':
								sendTextMessage(senderID,"Calendario académico:")
								sendMessageImage(senderID,'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497738551/calendario_academico_tv8z94.jpg')
								sendTextMessageAyuda(senderID)								
							break;
							case 'CLICK_CASO_ESPECIAL':
								sendCasoEspecialButtonTemplate(senderID);
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_ADMITIDOS_PSA':
								sendAdmitidosPsaButtonTemplate(senderID);
								sendTextMessageAyuda(senderID);
							break;
							case 'CLICK_UBICACIONES':
								sendUbicacionesTemplate(senderID);
							break;
							default:
							
						}
					}
				}
			})
		})
	}
	res.sendStatus(200)
})

function sendMessageFile(recipientID,url) {
	var messageData = {
		"recipient":{
	    	"id":recipientID
	  	},
	  	"message":{
	    	"attachment":{
	      		"type":"file",
	      		"payload":{
	        		"url":url
	      		}
	    	}
	  	}
	}
	callSendAPI(messageData);
}

// Envía una imagen como mensaje.
function sendMessageImage(senderID,url) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: url
				}
			}
		}
	}
	callSendAPI(messageData)
}

function sendMallaTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [elementMallaInfTemplate(),elementMallaSisTemplate(),elementMallaRedTemplate()]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function elementMallaInfTemplate() {
	return {
		title: "Ingeniería en Informática",
		image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563107/malla_informatica_jexiff.jpg',
		//image_url: 'https://www.facebook.com/photo.php?fbid=10206844124994784&set=a.1488259599569.2061923.1026303721&type=3&theater',
		subtitle: "Malla Curricular de Ingeniería en Informática",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver malla","http://www.uagrm.edu.bo/carreras/plan_estudio.php?codigo=187&plan=3"),
			buttonTemplatePostback("CLICK_IMG_MALLA_INF","Ver imagen"),
			buttonTemplatePostback("CLICK_PDF_MALLA_INF","Ver tríptico")
		]
	}
}

function elementMallaSisTemplate() {
	return {
		title: "Ingeniería en Sistemas",
		image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563037/malla_sistemas_euqjvn.jpg',
		subtitle: "Malla Curricular de Ingeniería en Sistemas",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver malla","http://www.uagrm.edu.bo/carreras/plan_estudio.php?codigo=187&plan=4"),
			buttonTemplatePostback("CLICK_IMG_MALLA_SIS","Ver imagen"),
			buttonTemplatePostback("CLICK_PDF_MALLA_SIS","Ver tríptico")
		]
	}
}
function elementMallaRedTemplate() {
	return {
		title: "Ingeniería en Redes y Telecomunicaciones",
		image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563041/malla_redes_dpzos0.jpg',
		subtitle: "Malla Curricular de Ingeniería en Redes y Telecomunicaciones",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver malla","http://www.uagrm.edu.bo/carreras/plan_estudio.php?codigo=187&plan=5"),
			buttonTemplatePostback("CLICK_IMG_MALLA_RED","Ver imagen"),
			buttonTemplatePostback("CLICK_PDF_MALLA_RED","Ver tríptico")
		]
	}
}

function sendMenuTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [elementMenuTemplate1(senderID),elementMenuTemplate2(senderID)]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function elementMenuTemplate1(senderID) {
	return {
		title: "Ver sobre..",	
		//subtitle: "Malla Curricular de Ingeniería en Informática",		
		buttons: [
			buttonTemplatePostback("CLICK_IMG_MAPA","Mapa UAGRM"),
			buttonTemplatePostback("CLICK_PSA","PSA"),			
			buttonTemplatePostback("CLICK_ADMITIDOS_PSA","Admitidos PSA I/2017 - Bloqueos")
		]
	}
}

function elementMenuTemplate2(senderID) {
	return {
		title: "Ver sobre..",	
		//subtitle: "Malla Curricular de Ingeniería en Informática",		
		buttons: [
			buttonTemplatePostback("CLICK_CASO_ESPECIAL","Caso especial"),			
			buttonTemplate("Cambio de Carrera","http://uagrm.edu.bo/unid_adm/registro/files/2014_01_09_09_07_55.html"),
			buttonTemplate("Carrera Paralela","http://uagrm.edu.bo/unid_adm/registro/files/2016_02_22_11_37_40.html")			
		]
	}
}
function elementMenuTemplate3(senderID) {
	return {
		title: "Ver sobre..",	
		//subtitle: "Malla Curricular de Ingeniería en Informática",		
		buttons: [
			buttonTemplate("PSA","http://www.uagrm.edu.bo/carreras/plan_estudio.php?codigo=187&plan=3"),
			buttonTemplatePostback("CLICK_IMG_MALLA_INF","Cambio de carrera"),
			buttonTemplatePostback("CLICK_PDF_MALLA_INF","Carrera Paralela")
		]
	}
}

function sendCasoEspecialButtonTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: casoEspecialInfo(),
					buttons: [buttonTemplate("Procedimientos..","http://uagrm.edu.bo/unid_adm/registro/files/2012_10_01_12_01_29.html")]
				}
			}
		}
	}
	callSendAPI(messageData)	
}

function casoEspecialInfo() {
	return'PROCEDIMIENTO\nPASO 1: Pago\nPago de matrícula en entidades financieras con Carnet de Identidad original vigente.\n\nPASO 2: Test Psicotécnico y Preinscripción\nLLENAR CON LOS DATOS CORRESPONDIENTES EN EL FORMULARIO DE PREINSCRIPCIÓN E IMPRIMIR, página web: www.uagrm.edu.bo\n\nPASO 3: Inscripción\nPersonalmente debe entregar los requisitos según el calendario de inscripción en la Sala de Cómputo del Depto. Admisión Estudiantil,  Pabellón 145, Campus Universitario...'
}

function sendStartButtonTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: "Elige una de las opciones a continuación y te mostraré más información al respecto.",
					buttons: [
						buttonTemplatePostback("CLICK_CALENDARIO","Calendario académico"),
						buttonTemplatePostback("CLICK_MALLA","Mallas Curriculares"),
						buttonTemplatePostback("CLICK_VER_MAS","Más opciones")
					]
				}
			}
		}
	}
	callSendAPI(messageData)
}
function sendMenuButtonTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: "Tengo estas opciones para ti.\nElige una de ellas y te mostraré más información al respecto.",
					buttons: [
						buttonTemplatePostback("CLICK_CALENDARIO","Calendario académico"),
						buttonTemplatePostback("CLICK_MALLA","Mallas Curriculares"),
						buttonTemplatePostback("CLICK_VER_MAS","Más opciones")
					]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function sendButtonTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: "¿Qué desea?",
					buttons: [buttonTemplate("Leer más..","http://www.uagrm.edu.bo/formas/adm/files/2017_05_22_08_30_04.html"),
					buttonTemplatePostback("CLICK_INFO","Info"),
					buttonTemplatePostback("CLICK_MALLA","Malla")]
				}
			}
		}
	}
	callSendAPI(messageData)
}

// PSA
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
	callSendAPI(messageData)	
}

function psaInfo() {
	return'PROCEDIMIENTO PSA\nPASO 1: Pago\nPago de matrícula en entidades financieras con Carnet de Identidad original vigente.\n\nPASO 2: Test Psicotécnico y Preinscripción\nLLENAR CON LOS DATOS CORRESPONDIENTES EN EL FORMULARIO DE PREINSCRIPCIÓN E IMPRIMIR, página web: www.uagrm.edu.bo\n\nPASO 3: Inscripción\nPersonalmente debe entregar los requisitos según el calendario de inscripción en la Sala de Cómputo del Depto. Admisión Estudiantil,  Pabellón 145, Campus Universitario...'
}

// Admitidos PSA I - 2017
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
					buttons: [buttonTemplate("Leer más..","http://uagrm.edu.bo/unid_adm/registro/files/2015_07_14_16_56_45.html"),
						buttonTemplatePostback("CLICK_UBICACIONES","Ubicaciones")]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function admitidosInfo() {
	return "ESTUDIANTES NUEVOS (QUE FUERON ADMITIDOS A LA U.A.G.R.M.)\n\n-Deben seguir 6 pasos que se detallan a continuación.\nNota.- Si presenta algún bloqueo debe revisar su perfil académico en la sección Bloqueos.\nEn Leer más obtendrás más detalles.";
}

// ADMITIDOS PSA I - 2017 -> UBICACIONES
function sendUbicacionesTemplate(senderID) {
	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [elementUbicacionesTemplate1(),
					elementUbicacionesTemplate2(),
					elementUbicacionesTemplate3()]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function elementUbicacionesTemplate1() {
	return {
		title: "1. Revisión Médica",
		//image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563107/malla_informatica_jexiff.jpg',
		//image_url: 'https://www.facebook.com/photo.php?fbid=10206844124994784&set=a.1488259599569.2061923.1026303721&type=3&theater',
		subtitle: "Costo Bs.- 80 Pagar en caja Campus",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver ubicación","https://www.google.com.bo/maps/place/17%C2%B046'36.2%22S+63%C2%B011'27.3%22W/@-17.776724,-63.1914572,19z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d-17.776724!4d-63.19091?hl=es-419&authuser=0&authuser=0&hl=es-419")
		]
	}
}
function elementUbicacionesTemplate2() {
	return {
		title: "2. Análisis clínico",
		//image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563107/malla_informatica_jexiff.jpg',		
		subtitle: "Costo Bs.- 120 Pagar en el módulo medicina",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver ubicación","https://www.google.com.bo/maps/place/17%C2%B046'31.0%22S+63%C2%B011'53.9%22W/@-17.775278,-63.1988492,193m/data=!3m2!1e3!4b1!4m5!3m4!1s0x0:0x0!8m2!3d-17.775278!4d-63.198302?hl=es-419&authuser=0&authuser=0&hl=es-419")
		]
	}
}
function elementUbicacionesTemplate3() {
	return {
		title: "3. Fotografía",
		//image_url: 'http://res.cloudinary.com/dwxz1lnfb/image/upload/v1497563107/malla_informatica_jexiff.jpg',
		//image_url: 'https://www.facebook.com/photo.php?fbid=10206844124994784&set=a.1488259599569.2061923.1026303721&type=3&theater',
		subtitle: "Costo Bs.- 12 Pagar en caja Campus\nVer ubicación para saber en donde sacarse la Fotografía",
		//item_url: "http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg",
		buttons: [
			buttonTemplate("Ver ubicación","https://www.google.com.bo/maps/place/17%C2%B046'40.4%22S+63%C2%B011'29.2%22W/@-17.777881,-63.1920887,229m/data=!3m2!1e3!4b1!4m5!3m4!1s0x0:0x0!8m2!3d-17.777881!4d-63.191439?hl=es-419&authuser=0&authuser=0&hl=es-419")
		]
	}
}

function buttonTemplatePostback(payload,title) {
	return {
		type: 'postback',
		title: title,
		payload: payload
	}
}


function sendGenericTemplate(recipientID) {
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [elementTemplate(),elementTemplate(),elementTemplate()]
				}
			}
		}
	}
	callSendAPI(messageData)
}

function elementTemplate() {
	return {
		title: "¡Bienvenido a la UAGRM! :D",
		image_url: 'http://www.uagrm.edu.bo/formas/adm/images/CARRERAS%20OFERTADAS%20%20PSA%20II%202017.jpg',
		subtitle: "Universidad Autónoma Gabriel René Moreno",
		buttons: [
			buttonTemplate("PSA","http://www.uagrm.edu.bo/forma_ingreso.php?codigo=35"),
			buttonTemplate("UAGRM","http://www.uagrm.edu.bo")
		]
	}
}

function buttonTemplate(title,url) {
	return {
		type: "web_url",
		title: title,
		url: url
	}
}

function  getMessage(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;
	//var a = callUserAPI(senderID);
	//var first_name = a.first_name;

	console.log("Mensaje recibido por el usuario %d por la págona %d",senderID,recipientID);
	//console.log("El nombre es %d",a);
	//console.log(a);
	var messageID = message.mid;
	var messageText = message.text;
	var attachments = message.attachments;
	var quick_replies = message.quick_replies;

	if (messageText) {

		if (isContain(toLowerCaseH(messageText),'hola')) {
			sendTextMessage(senderID,"¡Hola! Tengo información lista para ti.");
			sendStartButtonTemplate(senderID);
		}else if (isContain(toLowerCaseH(messageText),'triptico') ||
			isContain(toLowerCaseH(messageText),'tríptico') ||
			isContain(toLowerCaseH(messageText),'malla')) {
			sendMallaTemplate(senderID);
		}else if (isContain(toLowerCaseH(messageText),'info')) {
			sendTextMessage(senderID,"Tengo información lista para ti.");
			sendStartButtonTemplate(senderID);
		}else if(isContain(toLowerCaseH(messageText),'psa')) {
			sendTextMessage(senderID,"Tengo estas opciones a continuación.")
			sendMenuTemplate(senderID)
			sendTextMessageAyuda(senderID)
		}else if (isContain(toLowerCaseH(messageText),'gracias')) {
			sendTextMessage(senderID,"¡De nada!. Estoy a tu disposición cuando lo requieras.")
		}else {
			sendTextMessage(senderID,"No entendí bien tu pregunta.\nTransferiré la misma a Eliot para que me enseñe más al respecto.")			
			sendMenuButtonTemplate(senderID)

		}
	} else if(attachments) {
		console.log("Hola! seccion de attachments");
	} else if (quick_replies){
		sendMessageQuickReplies(senderID,"Elige una categoría");
	}
}

function sendTextMessageAyuda(recipientId) {
	setTimeout(function() {
		sendTextMessage(recipientId,"¿En qué más puedo ayudarte?")	
	},7000);
}

function sendTextMessage (recipientId,message) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: message
		}
	}
	callSendAPI(messageData);
}

function callSendAPI (messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages?access_token='+ PAGE_ACCESS_TOKEN,
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Mensaje enviado con éxito!")
			var recipientID = body.recipient_id;
			var messageID = body.message_id;
			//console.log(recipientID);
		} else {
			console.log("No fué posible enviar el mensaje!")
		}
	});
}

function callUserAPI (user_id) {
	var res = request({
		uri: 'https://graph.facebook.com/v2.6/'+user_id+'?access_token='+ PAGE_ACCESS_TOKEN,
		method: 'GET',
		json:true
	}, function(error, response, body) {
		if (!error) {
			console.log("Mensaje enviado con éxito desde CALLUSERAPI!")
			var recipientID = body.recipient_id;
			var messageID = body.message_id;
			/*console.log(body)
			console.log(body.first_name)*/
			//return body;
		} else {
			console.log("No fué posible enviar el mensaje!")
		}
	});
	//return res;
}



function isContain(text,word) {
	return text.indexOf(word) >= 0
}

function toLowerCaseH(word) {
	return word.toLowerCase();
}

function sendMessageQuickReplies(recipientID,text) {
	var messageData = {
		"recipient":{
    "id":recipientID
  },
  "message":{
    "text":text,
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Música",
        "payload":"MUSIC"
      },
      {
        "content_type":"text",
        "title":"Accesorios",
        "payload":"ACCS"
      }
    ]
  }
	}
	callSendAPI(messageData);
}

function getStarted() {
	var messageData = {
		get_started: {
			payload: "GET_STARTED_PAYLOAD"
		}
	}
	callSendAPI(messageData);
}

function startPersistentMenu() {
	var messageData = {
		"persistent_menu":[
		    {
		      "locale":"default",
		      "composer_input_disabled":true,
		      "call_to_actions":[
		        {
		          "title":"My Account",
		          "type":"nested",
		          "call_to_actions":[
		            {
		              "title":"Pay Bill",
		              "type":"postback",
		              "payload":"PAYBILL_PAYLOAD"
		            },
		            {
		              "title":"History",
		              "type":"postback",
		              "payload":"HISTORY_PAYLOAD"
		            },
		            {
		              "title":"Contact Info",
		              "type":"postback",
		              "payload":"CONTACT_INFO_PAYLOAD"
		            }
		          ]
		        },
		        {
		          "type":"web_url",
		          "title":"Latest News",
		          "url":"http://petershats.parseapp.com/hat-news",
		          "webview_height_ratio":"full"
		        }
		      ]
		    },
		    {
		      "locale":"zh_CN",
		      "composer_input_disabled":false
		    }
  		]
	}
	callSendAPI(messageData);
}