const api = require('./api');
setInterval(async () => {
    const result = await api.depth();
    console.log(`Maior preço de compra: ${result.bids[0][0]}`);
    console.log(`Maior preço de venda: ${result.asks[0][0]}`);

    const buy = parseInt(result.bids[0][0]);
    const sell = parseInt(result.asks[0][0])

    if(sell < 58000) {
        console.log('Hora de comprar')
    }else if(buy > 62000) {
        console.log('Hora de vender')
    }else{
        console.log('Fica quieto !')
    }
},process.env.CRAWLER_INTERVAL)




