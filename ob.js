"use strict";
const util = require('util')
 var ws = require('./ws')
 var cors = require('cors')
 var express = require('express')
var app = express()
app.use(cors())
// const database = require('./database');
const log = require ('ololog').noLocate
    , ccxt =  require ('ccxt')

let printSupportedExchanges = function () {
    log ('Supported exchanges:', ccxt.exchanges.join (', ').green)
}

let printUsage = function () {
    log ('Usage: node', process.argv[1], 'exchange'.green, 'symbol'.yellow, 'depth'.cyan)
    printSupportedExchanges ()
}

let printOrderBook = async (id, symbol, depth) => {

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
                ws.sendMessage(dataObje);
                log ('')
            }
        } else {
            log.error ('Symbol', symbol.bright, 'not found')
        }
    } else {
        printSupportedExchanges ()
    }
}

;(async function main () {
    startTicker()
}) ()

async function startTicker() {
    if (process.argv.length > 4) {
        const id = process.argv[2]
        const symbol = process.argv[3].toUpperCase ()
        const depth = parseInt (process.argv[4])
        await printOrderBook (id, symbol, depth)

    } else {
        const id = 'bitmex'
        const symbol = 'BTC/USD'
        const depth = '10'
        await printOrderBook (id, symbol, depth)
    }
}