const readline = require('readline');
const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);

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


    if(sell < 56000) {
        console.log('Hora de comprar');

        const account = await api.accountInfo();
        const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
        console.log('POSIÇÃO NA CARTEIRA');
        console.log(coins);

        const qtdInputada = 0.001;
        const valorQtd = sell * qtdInputada;

        console.log('Verificando se tenho grana...');
            
        if(valorQtd <= parseInt(coins.find(c => c.asset === 'USDT').free)){
            console.log("Temos grana, vamos comprar (To the moon) !!!");
            const buyOrder = await api.newOrder(symbol, qtdInputada);
            console.log(`orderId: ${buyOrder.orderId}`);
            console.log(`status: ${buyOrder.status}`);
           

            console.log('Posicionando venda futura...');
            const price = parseFloat(valorQtd * profitability);
            console.log(`Vendendo por ${price} (${profitability})`);
            const sellOrder = await api.newOrder(symbol, qtdInputada, price.toFixed(2), 'SELL', 'LIMIT');
            console.log(`orderId: ${sellOrder.orderId}`);
            console.log(`status: ${sellOrder.status}`);      
        }
        

    }else if(buy > 62000) {
        console.log('Hora de vender');
    }else{
        console.log('Fica quieto !');
    } 

},process.env.CRAWLER_INTERVAL)




