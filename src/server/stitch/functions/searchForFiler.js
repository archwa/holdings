exports = function(q){
  const db = context.services.get("mongodb-atlas").db("filings");
  const filers = db.collection("filers");
  
  
  return filers.find({
    "$text": {
      "$search": q.toString()
    } 
  },
  { 
    "score": { 
      "$meta": "textScore"
    }
  }).sort( { "score": { $meta: "textScore" } } ).toArray()
    .then(resFilers => {
      // no or many results; return filers results
      if(resFilers.length !== 1) {
        return [resFilers.length, resFilers];
      }

      // one result; return holders for that result
      const filer = resFilers[0];
      return Promise.all([resFilers.length, context.functions.execute("getHoldingsForFiler", filer.cik)]);
    })
    .then(res => {
      const lenRes = res[0];
      const resData = res[1];
      
      const result = {
        query: {
          q: q.toString(),
          type: "filer"
        },
        status: 0,
        message: `Found ${lenRes} results for \`q\` = \`${q.toString()}\`!  See \`data\` for more info.`,
        data: {
          "count": lenRes,
          "results": resData
        }
      };
        
      return result;
    })
    .catch(err => ({
      query: {
        q: q.toString(),
        type: "filer"
      },
      status: -1,
      message: `Error while running \`searchForFiler\`: ${err}`
    }));
};
