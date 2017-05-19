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
			if(text.includes("kaart")){ 
			sendTextMessage(sender, "Leuk dat je kaartjes wil bestellen, waar wil je naartoe? ")
			}
			else if(text.includes("ticket")){ 
			sendTextMessage(sender, "Leuk dat je tickets wil bestellen, waar wil je naartoe? ")
			}
			else if(text.includes("bewijs")){ 
			sendTextMessage(sender, "Leuk dat je kaartjes wil bestellen, waar wil je naartoe? ")
			}
			else if(text.includes("kaart" && "festival")){ 
			sendTextMessage(sender, "Leuk dat je naar een festival wil! Wat voor kaartjes wil je?")
			sendGenericMessage(sender)
			}
			else if(text.includes("ticket" && "festival")){
				sendTextMessage(sender, "Leuk dat je naar een festival wil! Wat voor kaartjes wil je?")
				sendGenericMessage(sender)
			}
			else if(text.includes("bewijs" && "festival")){
				sendTextMessage(sender, "Leuk dat je naar een festival wil! Wat voor kaartjes wil je?")
				sendGenericMessage(sender)
			}
			else if(text.includes("H")){
				sendTextMessage(sender, "Hoi! Wat kan ik voor je doen?")
			}
			else{
				sendTextMessage(sender, "Sorry, ik begrijp je niet helemaal, probeer eens kaartjes te bestellen! ")
			}
			if(text.includes("Wat kan je")){
				sendTextMessage(sender, "Ik kan je helpen om kaartjes te bestellen voor een festival !")
			}
			}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			//sendTextMessage(sender, "Je bestelling is ontvangen! Als je via de onderstaande link betaalt sturen we ze direct naar je toe.")
			sendGeneric2Message(sender)
			/*if (res.sendStatus(200) = true){ 
			sendGeneric3Message(sender)
			}*/
			continue
		}
		
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN
var token = "EAADAKF2rD7UBAHFPNtbSgcobModwbCstgthKey8yPp0HACPGlW3W45nEaB9SEtldMaP0l7sQBobiFDtDdDjr82lLnKiDss5fndtqkVjZC2DZBnW9kOQBdKnulJh0T13gyTeouEoi2IaqjIIsD9axEOuZCCcsgMfsxlvERr5uQZDZD"

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

						"title": "1 Regular",

						"payload": "Leuk dat je één Regular ticket wil kopen!"

					}, {

						"type": "postback",

						"title": "2 Regular",

						"payload": "Leuk dat je 2 Regular tickets wil kopen!"

					},{
						
						"type": "postback",

						"title": "3 Regular",

						"payload": "Leuk dat je 3 Regular tickets wil kopen!"
					}],

				}, {

					"title": "Vip Tickets",

					"subtitle": "Ga naar links voor de Regular Tickets",

					"image_url": "https://www.visitljubljana.com/assets/gallery/flow.jpg",

					"buttons": [{

						"type": "postback",

						"title": "1 VIP",

						"payload": "Leuk dat je één VIP ticket wil kopen!",

					},	{

						"type": "postback",

						"title": "2 VIP",

						"payload": "Leuk dat je 2 VIP tickets wil kopen!",

					},{

						"type": "postback",

						"title": "3 VIP",

						"payload": "Leuk dat je 3 VIP tickets wil kopen!",

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

					"title": "Je bestelling is ontvangen!",

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
