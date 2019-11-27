exports = function(q){
  /*
    
    purpose: search for both filers and issuers
    
  */
  return Promise.all([context.functions.execute('searchForFiler', q), context.functions.execute('searchForIssuer', q)])
    .then(res => {
      const filerSearch = res[0];
      const issuerSearch = res[1];
      
      const result = {
        query: {
          q,
          type: "company"
        },
        status: 0,
        message: `Finished compound search (company: filers and issuers).  See \`data\` for more info.`,
        data: {
          filerSearch,
          issuerSearch
        },
      };
      
      return result;
    })
    .catch(err => ({
      query: {
        q,
        type: "company"
      },
      status: -1,
      message: `Error while running \`searchForCompany\`: ${err}`
    }));
};
