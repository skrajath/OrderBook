const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const log = require ('ololog').noLocate
    , ccxt =  require ('ccxt')

io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    5000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
  const id = 'bitmex'
  const symbol = 'BTC/USD'
  const depth = '10'
  // check if the exchange is supported by ccxt
  let exchangeFound = ccxt.exchanges.indexOf (id) > -1
  if (exchangeFound) {

      log ('Instantiating', id.green, 'exchange')
      // instantiate the exchange by id
      let exchange = new ccxt[id] ({ enableRateLimit: true })

      // load all markets from the exchange
      let markets = await exchange.loadMarkets ()


      // // output a list of all market symbols
      // log (id.green, 'has', exchange.symbols.length, 'symbols:', exchange.symbols.join (', ').yellow)
      if (symbol in exchange.markets) {

          const market = exchange.markets[symbol]
          const pricePrecision = market.precision ? market.precision.price : 8
          const amountPrecision = market.precision ? market.precision.amount : 8

          const priceVolumeHelper = color => ([price, amount]) => ({
              price: price.toFixed (pricePrecision)[color],
              amount: amount.toFixed (amountPrecision)[color],
          })

          const cursorUp = '\u001b[1A'
          const tableHeight = depth * 2 + 4
          var falg = true;
          while (falg) {
              const orderbook = await exchange.fetchOrderBook (symbol)
              var bids = orderbook.bids
              var asks = orderbook.asks
      
              var dataArray = [];
              bids.forEach(element => {
              
              var tempObject = {
                  "type": "bid",
                  "total": element[1],
                  "price":element[0]
              }
              dataArray.push(tempObject)
              });
              asks.forEach(element => {
              
              var tempObject = {
                  "type": "ask",
                  "total": element[1], 
                  "price":element[0]
              }
              
                  dataArray.push(tempObject)
              });
          
              console.log("asks dataArray=",dataArray);
              var dataObje = JSON.stringify(dataArray);
              //ws.sendMessage(dataObje);
              socket.emit("FromAPI", dataObje);
              log ('')
          }
      } else {
          log.error ('Symbol', symbol.bright, 'not found')
      }
  } else {
      printSupportedExchanges ()
  }
};

let printSupportedExchanges = function () {
  log ('Supported exchanges:', ccxt.exchanges.join (', ').green)
}

server.listen(port, () => console.log(`Listening on port ${port}`));