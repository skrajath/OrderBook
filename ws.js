var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 7979})
 var wsSocket ;
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })
})

function saveSocket(ws) {
  // We want this to show the "results" from the callback function.
  wsSocket = ws;
  console.log('set saveSocket');

 }

var sendMessageFunction = function(message){
  // if (wsSocket != null) {
    
    wss.clients.forEach(function each(client) {
      if (client.isAlive === false){

      }else {
        client.send(message);
      }
    });
  
};
 module.exports = {
   sendMessage : sendMessageFunction
 }