exports = function(cusip6) {
  const db = context.services.get("mongodb-atlas").db("filings");
  const issuers = db.collection("issuers");
  const holdings = db.collection("holdings");
  
  return issuers.find({ cusip6 }).toArray()
    .then(resIssuers => {
      if(!resIssuers.length) {
        return [ [], [] ];
      }
      
      const issuerNames = resIssuers[0].names;
      
      const pipeline = [
        {
          "$match": {
            cusip6
          }
        },
        {
          "$lookup": {
            from: "filers",
            localField: "cik",
            foreignField: "cik",
            as: "matched_filers"
          }
        },
        {
          "$addFields": {
            filer_names: {
              "$map": {
                input: "$matched_filers",
                "as": "matched_filer",
                "in": "$$matched_filer.name"
              }
            }
          }
        },
        {
          "$project":   {
            "from": 1,
            "to": 1,
            "ownership_length": 1,
            "cik": 1,
            "cusip9": 1,
            "filer_names": 1
          }
        }
      ];
      
      return Promise.all([ issuerNames, holdings.aggregate(pipeline).toArray() ]);
    })
    .then(res => {
      issuerNames = res[0];
      resHoldings = res[1];
      
      // get current year and quarter
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentQuarter = ~~(date.getMonth() / 4) + 1;
      
      const result = {
        query: {
          cusip6,
          type: "issuer"
        },
        status: 0,
        message: `Found ${resHoldings.length} holdings for \`cusip6\` = \`${cusip6}\`!  See \`data\` for more info.`,
        data: {
          "issuer_names": issuerNames,
          "issuer_cusip6": cusip6,
          "count": resHoldings.length,
          "holdings": resHoldings
        }
      };
      
      return result;
    })
    .catch(err => ({
      query: {
        cusip6,
        type: "issuer"
      },
      status: -1,
      message: `Error while running \`getHoldersForIssuer\`: ${err}`
    }));
};