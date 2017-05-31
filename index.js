'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

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
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			
        if(event.postback)

        {

            receivedPostback(event);

        }
			if(text.includes("flow festival")){
				sendTextMessage(sender, "Leuk dat je naar het flow festival wil! Wat voor kaartjes zou je willen?")
				sendGenericMessage(sender)
			}
			else if(text.includes("kaart")){ 
				sendTextMessage(sender, "Ik wil graag kaartjes voor je bestellen, probeer eens het flow festival!")
			}
			else if(text.includes("ticket")){ 
				sendTextMessage(sender, "Ik wil graag tickets voor je bestellen, probeer eens het flow festival!")
			}
			else if(text.includes("bewijs")){ 
				sendTextMessage(sender, "Ik wil graag kaartjes voor je bestellen, probeer eens het flow festival!")
			}
			else if(text.includes("H")){
				sendTextMessage(sender, "Hoi, wat kan ik voor je doen?")
			}
			else{
				sendTextMessage(sender, "Sorry, ik begrijp je niet helemaal, probeer eens kaartjes te bestellen! ")
			}
		}
		/*if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Hoe veel kaartjes wil je bestellen? Je kan er maximaal 5 per persoon bestellen!")
			sendGeneric3Message(sender)
			//sendTextMessage(sender, "Je bestelling is ontvangen! Als je via de onderstaande link betaalt sturen we ze direct naar je toe.")
			//sendGeneric2Message(sender)
			/*if (res.sendStatus(200) = true){ 
			sendGeneric3Message(sender)
			}
			continue
		}
		if (event.postback.buttons.title = "1"){
			let text = JSON.stringify(event.postback.buttons.title = "1")
			sendTextMessage(sender,  "Veel plezier daar!")
		}*/
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
var token = "EAADAKF2rD7UBAHFPNtbSgcobModwbCstgthKey8yPp0HACPGlW3W45nEaB9SEtldMaP0l7sQBobiFDtDdDjr82lLnKiDss5fndtqkVjZC2DZBnW9kOQBdKnulJh0T13gyTeouEoi2IaqjIIsD9axEOuZCCcsgMfsxlvERr5uQZDZD"

function recievedPostBack(event){
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var payload = event.postback.payload;
	switch (payload)
{
	case 'REGULAR':
		sendTextMessage(sender, "Hoe veel kaartjes wil je bestellen?")
		sendGeneric3Message(sender)
		break;

	case 'VIP':
		sendTextMessage(sender, "Hoe veel kaartjes wil je bestellen?")
		sendGeneric3Message(sender)
		break;

	case '1':
		sendTextMessage(sender, "Leuk dat je één kaartje wil bestellen, klik op de onderstaande link om te betalen!")
		sendGeneric3Message(sender)
		break;

	case '2':
		sendTextMessage(sender, "Leuk dat je twee kaartjes wil bestellen, klik op de onderstaande link om te betalen!")
		sendGeneric3Message(sender)
		break;

	case '3':
		sendTextMessage(sender, "Leuk dat je drie kaartjes wil bestellen, klik op de onderstaande link om te betalen!")
		sendGeneric3Message(sender)
		break;

	case '4':
		sendTextMessage(sender, "Leuk dat je vier kaartjes wil bestellen, klik op de onderstaande link om te betalen!")
		sendGeneric3Message(sender)
		break;

	case '5':
		sendTextMessage(sender, "Leuk dat je vijf kaartjes wil bestellen, klik op de onderstaande link om te betalen!")
		sendGeneric3Message(sender)
		break;
	}
}

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
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

						"payload": "REGULAR"
					}],

				}, {

					"title": "Vip Tickets",

					"subtitle": "Ga naar links voor de Regular Tickets",

					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "VIP tickets!",

						"payload": "VIP",

					}],
					
				}]

			}

		}

	}

	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: {access_token:token},

		method: 'POST',

		json: {

			recipient: {id:sender},

			message: messageData,

		}

	}, function(error, response, body) {

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

		qs: {access_token:token},

		method: 'POST',

		json: {

			recipient: {id:sender},

			message: messageData,

		}

	}, function(error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}

/*function sendQuickReply(sender) {
	let messageData = { "recipient":{
    "id":"USER_ID"
  },
  "message":{
    "text":"Pick a color:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Red",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
      },
      {
        "content_type":"text",
        "title":"Green",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ]
  }
}
	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: {access_token:token},

		method: 'POST',

		json: {

			recipient: {id:sender},

			message: messageData,

		}

	}, function(error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}*/

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

						"payload": "1" //Hier kan link van payments??
					},{
						"type": "postback",

						"title": "2",

						"payload": "2" //Hier kan link van payments??
					},{
						"type": "postback",

						"title": "3",

						"payload": "3" //Hier kan link van payments??
					}],

				}, {

					"title": "Aantal kaartjes",

					"subtitle": "Ga naar links voor een kleinere kaartkeuze!",

					//"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "4",

						"payload": "4",
					},{
						"type": "postback",

						"title": "5",

						"payload": "5" //Hier kan link van payments??
					}],
					
				}]

			}

		}

	}

	request({

		url: 'https://graph.facebook.com/v2.6/me/messages',

		qs: {access_token:token},

		method: 'POST',

		json: {

			recipient: {id:sender},

			message: messageData,

		}

	}, function(error, response, body) {

		if (error) {

			console.log('Error sending messages: ', error)

		} else if (response.body.error) {

			console.log('Error: ', response.body.error)

		}

	})

}


function sendButtonMessage(sender, text){
	let messagedata = {
		"message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          {
            "type":"web_url",
            "title":"Vip",
            "payload":"Leuk dat je Vip tickets wil bestellen ! Hoe veel wil je er bestellen?"
          },
          {
            "type":"postback",
            "title":"Regular",
            "payload":"Leuk dat je regular tickets wil bestellen! Hoe veel wil je er bestellen?"
          }
        ]
      }
    }
  }
}
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
