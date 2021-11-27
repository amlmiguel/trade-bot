 const axios = require('axios');
 const querystring = require('querystring')

 async function publicCall(path, data, method ='GET'){
    try{

        const qs = data ? `?${querystring.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        })
        return result.data;

    }
    catch(err){
        console.log(err);
    }
 }

 // Hora
 async function time(){
     return publicCall('/v3/time');
 }

 // Preço
 async function depth(symbol = 'BTCUSDT', limit = 5){
    return publicCall('/v3/depth', {symbol, limit});
}

// Consulta o Long Short Ratio
async function lsr(symbol = 'BTCUSDT', period = '5m'){
    return publicCall('/futures/data/globalLongShortAccountRatio', {symbol, period});
}

// Colocar ordem
async function newOrder(symbol, quantity, price, side = 'BUY', type='MARKET'){
    const data = {symbol, side, type, quantity};

    if(price) data.price = price;
    if(type === 'LIMIT') data.timeInForce = 'GTC'; // Até a ordem se cancelada

    return privateCall('/v3/order', data, 'POST');
}


 module.exports = { time, depth, lsr, newOrder }