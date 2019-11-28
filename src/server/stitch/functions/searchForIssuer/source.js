exports = function(q){
  const db = context.services.get("mongodb-atlas").db("filings");
  const issuers = db.collection("issuers");
  
  
  return issuers.find({
    "$text": {
      "$search": q.toString()
    } 
  },
  { 
    "score": { 
      "$meta": "textScore"
    }
  }).sort( { "score": { $meta: "textScore" } } ).toArray()
    .then(resIssuers => {
      // no or many results; return Issuers results
      if(resIssuers.length !== 1) {
        return [resIssuers.length, resIssuers];
      }

      // one result; return holders for that result
      const issuer = resIssuers[0];
      return Promise.all([resIssuers.length, context.functions.execute("getHoldersForIssuer", issuer.cusip6)]);
    })
    .then(resArr => {
      const lenRes = resArr[0];
      const resData = resArr[1];
      
      const result = {
        query: {
          q: q.toString(),
          type: "issuer"
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
        type: "issuer"
      },
      status: -1,
      message: `Error while running \`searchForIssuer\`: ${err}`
    }));
};