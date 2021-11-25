 const axios = require('axios');
 const querystring = require('querystring')

 async function publicCall(path, data, method ='GET'){
    try{

        const qs = data ? `?${querystring.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}`

        })

    }
    catch(err){
        console.log(err);
    }
 }