
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "ACf91e4cbdc02b5c7513c73069201b5a97";
const authToken = "b64b37e46e249062fa48898501d9729a";
const client = require('twilio')(accountSid, authToken);


// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs? https://google.com',
//      from: '+19123243816',
//      to: '+14083348123123698'
//    })
//    .catch(err => console.log(err))
//   .then(message => console.log(message.sid));


// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure

client.lookups.v1.phoneNumbers('4083348621398s')
                 .fetch({countryCode: 'US'})
                 .catch(err => console.log(err))
                 .then(phone_number => console.log(phone_number.phoneNumber));
