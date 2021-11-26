 const axios = require('axios');
 const querystring = require('querystring');
 const crypto = require('crypto');

 const apiKey = process.env.API_KEY;
 const apiSecret = process.env.SECRET_KEY;
 const apiUrl = process.env.API_URL;

 async function privateCall(path, data = {}, method = 'GET'){
     const timestamp = Date.now();
     const signature = crypto.createHmac('sha256',apiSecret)
                     .update(`${querystring.stringify({...data, timestamp})}`)
                     .digest('hex');

    const newData = {...data, timestamp, signature};
    const qs = `?${querystring.stringify(newData)}`;

    try {
        const result = await axios ({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: {'X-MBX-APIKEY': apiKey}
        })
        return result.data;
    } 
    catch (err){
        console.log(err);
    }   
    }

async function accountInfo(){
    return privateCall('/v3/account');
}

 

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

 async function time(){
     return publicCall('/v3/time');
 }

 async function depth(symbol = 'BTCUSDT', limit = 5){
    return publicCall('/v3/depth', {symbol, limit});
}

 async function exchangeInfo(){
    return publicCall('/v3/exchangeInfo');
}

// async function lsr(symbol = 'BTCUSDT', period = '5m'){
//     return publicCall('/futures/data/globalLongShortAccountRatio', {symbol, period});
// }



 module.exports = { time, depth, exchangeInfo, accountInfo }