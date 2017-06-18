const request = require('request');
var apiFb = require('./apifb');



function buttonTemplate(title,url) {
	return {
		type: "web_url",
		title: title,
		url: url
	}
}
