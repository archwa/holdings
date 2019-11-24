exports = function(q){
  const db = context.services.get("mongodb-atlas").db("filings");
  const symbols = db.collection("symbols");
  
  const symbolString = q.toUpperCase().trim();
  
  return symbols.find({ symbol: symbolString }).toArray()
    .then(resSymbols => {
      if(!resSymbols.length) {
        return {
          query: {
            q: symbolString,
            type: "symbol"
          },
          status: 0,
          message: `No symbols found.`
        };
      }
      
      const symbol = resSymbols[0];
      const name = symbol.names[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
      
      // perform searches (if applicable)
      const filerSearch = symbol.ciks && symbol.ciks.length?
            symbol.ciks.map(cik => context.functions.execute("getHoldingsForFiler", cik))
          : context.functions.execute("searchForFiler", `"${name}"`);
      const issuerSearch = context.functions.execute("searchForIssuer", `"${name}"`);
      
      return Promise.all([filerSearch, issuerSearch, symbol, name]);
    })
    .then(res => {
      const filerSearch = res[0];
      const issuerSearch = res[1];
      const symbol = res[2];
      const name = res[3];
      
      const preHoldingsView = filerSearch.length?
            filerSearch.map(filer => filer.data && filer.data.count? filer :null).filter(filer => filer !== null)
          : (!filerSearch.data || filerSearch.data.count !== 1? null :filerSearch.data.results);
      const holdingsView = !preHoldingsView || !preHoldingsView.length? null :holdingsView;
      const holdersView = !issuerSearch.data || issuerSearch.data.count !== 1? null :issuerSearch.data.results;

      const result = {
        query: {
          q: symbolString,
          type: "symbol"
        },
        status: 0,
        message: `Symbol found as \`${symbol.symbol}\`!  See \`data\` for more info.`,
        data: {
          symbol,
          holdingsView,
          holdersView,
        }
      };
        
      return result;
    })
    .catch(err => ({
      query: {
        q: symbolString,
        type: "symbol"
      },
      status: -1,
      message: `Error while running \`searchForSymbol\`: ${err}`
    }));
};
