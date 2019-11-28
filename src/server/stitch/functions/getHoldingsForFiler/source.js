exports = function(cik) {
  const db = context.services.get("mongodb-atlas").db("filings");
  const filers = db.collection("filers");
  const holdings = db.collection("holdings");
  
  return filers.find({ cik }).toArray()
    .then(resFilers => {
      if(!resFilers.length) {
        return [ [], [] ];
      }
      
      const filerNames = resFilers.map(filer => filer.name);
      
      const pipeline = [
        {
          "$match": {
            cik
          }
        },
        {
          "$lookup": {
            from: "issuers",
            localField: "cusip6",
            foreignField: "cusip6",
            as: "matched_issuer"
          }
        },
        {
          "$addFields": {
            "issuer_names": { "$arrayElemAt": [ "$matched_issuer", 0 ] }
          }
        },
        {
          "$project":   {
            "from": 1,
            "to": 1,
            "ownership_length": 1,
            "cusip6": 1,
            "cusip9": 1,
            "issuer_names": "$issuer_names.names"
          }
        }
      ];
      
      return Promise.all([ filerNames, holdings.aggregate(pipeline).toArray() ]);
    })
    .then(res => {
      filerNames = res[0];
      resHoldings = res[1];
      
      // get current year and quarter
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentQuarter = ~~(date.getMonth() / 4) + 1;
      
      const result = {
        query: {
          cik,
          type: "filer"
        },
        status: 0,
        message: `Found ${resHoldings.length} holdings for \`cik\` = \`${cik}\`!  See \`data\` for more info.`,
        data: {
          "filer_names": filerNames,
          "filer_cik": cik,
          "count": resHoldings.length,
          "holdings": resHoldings
        }
      };
      
      return result;
    })
    .catch(err => ({
      query: {
        cik,
        type: "filer"
      },
      status: -1,
      message: `Error while running \`getHoldingsForFiler\`: ${err}`
    }));
};