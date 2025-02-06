// NOTE: Needed in order to avoid depending on the window object
require('cometd-nodejs-client').adapt();

const lib = require('cometd');
const cometd = new lib.CometD();

const config = require('./config.json');
//const authLib = require('./lib/salesforceAuth.js');

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example API route to send a response to the frontend
app.get('/api/data', (req, res) => {
    main(res);
    //res.json({ message: 'Hello from Node.js server!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


async function main(res) {
  const authToken = '00D5i00000EV8cR!ARoAQMTdoa_lidqzGrSRaZzYfCwyn2k3TXIDp48QXCMRrLirqKLAGxzrJP9BFypIAjlb_K.q10ItTf8nHqW98ZnpJezLhSdz';//await authLib.authenticate(config);
  cometd.configure({
    url: `${config.myDomain}/cometd/62.0/`,
    requestHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
    appendMessageTypeToURL: false
  });

  cometd.handshake(function (h) {
    if (h.successful) {
      // Subscribe to receive messages from the server.
      console.log('Connected to Salesforce!');
      cometd.subscribe(config.platformEvent.topicChannel, function (message) {
        const dataFromServer = message.data;
        console.log('>>> Data: ');
        console.log(dataFromServer?.payload);
        res.json({ payload : dataFromServer?.payload }); 
      });
    }
  });
}