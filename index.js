const api = require('./api');
const symbol = process.env.SYMBOL;

setInterval(async () => {
    let buy, sell;

    const result = await api.depth(symbol);
    if(result.bids && result.bids.length){
        console.log(`Maior preço de compra: ${result.bids[0][0]}`);
        buy = parseInt(result.bids[0][0]);
    }

    if(result.asks && result.asks.length){
        console.log(`Maior preço de venda: ${result.asks[0][0]}`);
        sell = parseInt(result.asks[0][0])
    }


    if(sell < 58000) {
        console.log('Hora de comprar');

        const account = await api.accountInfo();
        const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
        console.log(coins)

    }else if(buy > 62000) {
        console.log('Hora de vender');
    }else{
        console.log('Fica quieto !');
    }

},process.env.CRAWLER_INTERVAL)




