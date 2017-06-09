'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_key') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			if (text.includes("flow festival")) {
				sendTextMessage(sender, "Leuk dat je naar het flow festival wil! Wat voor kaartjes zou je willen?")
				sendGenericMessage(sender)
			}
			else if (text.includes("kaart")) {
				sendTextMessage(sender, "Ik wil graag kaartjes voor je bestellen, probeer eens het flow festival!")
			}
			else if (text.includes("ticket")) {
				sendTextMessage(sender, "Ik wil graag tickets voor je bestellen, probeer eens het flow festival!")
			}
			else if (text.includes("bewijs")) {
				sendTextMessage(sender, "Ik wil graag kaartjes voor je bestellen, probeer eens het flow festival!")
			}
			else if (text.includes("H")) {
				sendTextMessage(sender, "Hoi, wat kan ik voor je doen?")
			}
			else {
				sendTextMessage(sender, "Sorry, ik begrijp je niet helemaal, probeer eens kaartjes te bestellen! ")
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			switch (event.postback.payload) {

				case 'Regular':
					sendTextMessage(sender, "Hoe veel kaartjes zou je willen?")
					//sendGeneric3Message(sender)
					sendQuickReply3(sender, quick_replies)
					break;

				case 'Vip':
					sendTextMessage(sender, "Hoe veel kaartjes zou je willen?")
					sendGeneric3Message(sender)
					break;

				case '1':
					sendTextMessage(sender, "Leuk dat je één kaartje wil!")
					sendGeneric2Message(sender)
					break;

				case '2':
					sendTextMessage(sender, "Leuk dat je twee kaartjes wil!")
					sendGeneric2Message(sender)
					break;

				case '3':
					sendTextMessage(sender, "Leuk dat je drie kaartjes wil!")
					sendGeneric2Message(sender)
					break;

				case '4':
					sendTextMessage(sender, "Leuk dat je vier kaartjes wil!")
					sendGeneric2Message(sender)
					break;

				case '5':
					sendTextMessage(sender, "Leuk dat je vijf kaartjes wil!")
					sendGeneric2Message(sender)
					break;
			}
			/*if (res.sendStatus(200) = true){ 
			sendGeneric2Message(sender)
			}*/
			continue
		}
		/*if (event.postback.buttons.title = "1"){
			let text = JSON.stringify(event.postback.buttons.title = "1")
			sendTextMessage(sender,  "Veel plezier daar!")
		}*/
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
var token = "EAADAKF2rD7UBAHFPNtbSgcobModwbCstgthKey8yPp0HACPGlW3W45nEaB9SEtldMaP0l7sQBobiFDtDdDjr82lLnKiDss5fndtqkVjZC2DZBnW9kOQBdKnulJh0T13gyTeouEoi2IaqjIIsD9axEOuZCCcsgMfsxlvERr5uQZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text: text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
			message: messageData,
		}
	}, function (error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {

	let messageData = {

		"attachment": {

			"type": "template",

			"payload": {

				"template_type": "generic",

				"elements": [{

					"title": "Regular Tickets",

					"subtitle": "Ga naar rechts voor de VIP Tickets",

					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "Regular tickets!",

						"payload": "Regular"
					}],

				}, {

					"title": "Vip Tickets",

					"subtitle": "Ga naar links voor de Regular Tickets",

					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "VIP tickets!",

						"payload": "Vip",

					}],

				}]

			}

		}

	}

	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: { access_token: token },

		method: 'POST',

		json: {

			recipient: { id: sender },

			message: messageData,

		}

	}, function (error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}

function sendGeneric2Message(sender) {

	let messageData = {

		"attachment": {

			"type": "template",

			"payload": {

				"template_type": "generic",

				"elements": [{

					"title": "Alleen nog afrekenen en je tickets zijn binnen!",

					"subtitle": "Klik op de onderstaande knop om te betalen!",

					//"image_url": "",

					"buttons": [{

						"type": "web_url",

						"url": "https://betaal.cmpayments.nl/check-out/ACH-44BA7A47-E96F-4263-83C1-3E3198F58A8F",

						"title": "Betalen"

					}],

				}]

			}

		}

	}

	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: { access_token: token },

		method: 'POST',

		json: {

			recipient: { id: sender },

			message: messageData,

		}

	}, function (error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}

function sendQuickReply(sender) {
	let messageData = {
		"attachment": {
			"type": "quick_reply",
			"payload": {
				"message": {
					"text": "Pick a color:",
					"quick_replies": [
						{
							"content_type": "text",
							"title": "Red",
							"payload": "rood"
						},
						{
							"content_type": "text",
							"title": "Green",
							"payload": "groen"
						}
					]
				}
			}
		}
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: {
			recipient: { id: sender },
			message: messageData,
		}
	}, function (error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

/*function sendQuickReply2(sender){

	let messageData = {
		 
		 var: newText = sendTextMessage(sender, "Wat is je favoriete karakter?")
		 
          .addQuickReply('about', 'about')
 
          .addQuickReply('talk', 'talk')
 
          .addQuickReply('RPS', 'RPS')
 
          .addQuickReply('emotion', 'emotion')

          .addQuickReply('contact', 'contact')
	}
}*/

function sendQuickReply3(sender,quick_replies) {

	let messageData = {

		 recipient: {
	 
		   id: sender
	 
		 },
		"attachment": {
			"type": "quick_reply",
			"payload": {
				"message": {

					"text": "What's your favorite movie genre?",

					"quick_replies": [

						{

							"content_type": "text",

							"title": "Action",

							"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"

						},

						{

							"content_type": "text",

							"title": "Comedy",

							"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"

						},

						{

							"content_type": "text",

							"title": "Drama",

							"payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"

						}

					]

				}

			}
		}
	}
}
function sendGeneric3Message(sender) {

	let messageData = {

		"attachment": {

			"type": "template",

			"payload": {

				"template_type": "generic",

				"elements": [{

					"title": "Aantal kaartjes",

					"subtitle": "Ga naar rechts voor een grotere kaartkeuze!",

					//"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "1",

						"payload": "1"
					}, {
						"type": "postback",

						"title": "2",

						"payload": "2"
					}, {
						"type": "postback",

						"title": "3",

						"payload": "3"
					}],

				}, {

					"title": "Aantal kaartjes",

					"subtitle": "Ga naar links voor een kleinere kaartkeuze!",

					//"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "4",

						"payload": "4",
					}, {
						"type": "postback",

						"title": "5",

						"payload": "5"
					}],

				}]

			}

		}

	}

	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: { access_token: token },

		method: 'POST',

		json: {

			recipient: { id: sender },

			message: messageData,

		}

	}, function (error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}


function sendButtonMessage(sender, text) {
	let messagedata = {
		"message": {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "button",
					"text": text,
					"buttons": [
						{
							"type": "web_url",
							"title": "Vip",
							"payload": "Leuk dat je Vip tickets wil bestellen ! Hoe veel wil je er bestellen?"
						},
						{
							"type": "postback",
							"title": "Regular",
							"payload": "Leuk dat je regular tickets wil bestellen! Hoe veel wil je er bestellen?"
						}
					]
				}
			}
		}
	}
}

// spin spin sugar
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})
