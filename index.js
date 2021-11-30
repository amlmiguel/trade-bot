const readline = require('readline');
const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);

setInterval(async () => {
    let buy, sell;

    const result = await api.depth(symbol);
    if(result.bids && result.bids.length){
        console.log(`Maior preço de compra: ${result.bids[0][0]}`);
        buy = parseFloat(result.bids[0][0]);
    }

    if(result.asks && result.asks.length){
        console.log(`Maior preço de venda: ${result.asks[0][0]}`);
        sell = parseFloat(result.asks[0][0])
    }


    if(sell && sell < 58000) {
        console.log('Hora de comprar');

        const account = await api.accountInfo();
        const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
        console.log('POSIÇÃO NA CARTEIRA');
        console.log(coins);

        const qtdInputada = 0.001;
        const valorQtd = sell * qtdInputada;

        console.log('Verificando se tenho grana...');
        const carteiraUSD = parseFloat(coins.find(c => c.asset === 'USDT').free);
            
        if(valorQtd <= carteiraUSD){
            console.log("Temos grana, vamos comprar (To the moon) !!!");
            const buyOrder = await api.newOrder(symbol, qtdInputada);
            console.log(`orderId: ${buyOrder.orderId}`);
            console.log(`status: ${buyOrder.status}`);
           
            if(buyOrder === 'FILLED'){
                console.log('Posicionando venda futura...');
                const price = parseFloat(valorQtd * profitability).toFixed(2);
                console.log(`Vendendo por ${price} (${profitability})`);
                const sellOrder = await api.newOrder(symbol, qtdInputada, price, 'SELL', 'LIMIT');
                console.log(`orderId: ${sellOrder.orderId}`);
                console.log(`status: ${sellOrder.status}`);  

            }
                
        }  

    }else if(buy && buy > 62000) {
        console.log('Hora de vender');
    }else{
        console.log('Fica quieto !');
    } 

},process.env.CRAWLER_INTERVAL)




