import React from 'react';
import _ from 'lodash';

// import individual results formatters
import { ResultsGetHoldersForTicker } from './functions/ResultsGetHoldersForTicker';
import { ResultsGetPositionsForFund } from './functions/ResultsGetPositionsForFund';
import { ResultsGetAverageTimePositionsHeldForFund } from './functions/ResultsGetAverageTimePositionsHeldForFund';

export class ResultsFormatter extends React.Component {

  constructor(props) {
    super(props);

    // define function results from action controller in state
    this.state = {
        results: this.props.results,
    };
  }

  componentDidUpdate() {
    if(!_.isEqual(this.props.results, this.state.results)) {
      this.setState({
        results: this.props.results,
      });
    } 
  }

  render() {
    const { results } = this.state;

    return (
      <div style={ styles.container }>
        {
          !_.get(results, 'companySearchResult', -1)?
            <>Showing results for fund <strong><code>"{ _.get(results, 'companySearchResult.data.filerSearch.data.count', '') }" (CIK : { _.get(results, 'companySearchResult.data.filerSearch.data.count', '') })</code></strong></>
          :null
        }

        {
          !_.get(results, 'searchForCompany.status', -1)?
            <>Showing results for company <strong><code>"{ _.get(results, 'searchForCompany.data.name', '') }" (CUSIP : { _.get(results, 'searchForCompany.data.cusip', '') })</code></strong></>
          :null
        }

        {
          // position average information
          !_.get(results, 'getAverageTimePositionsHeldForFund.status', -1)?
            <ResultsGetAverageTimePositionsHeldForFund
              results={ results.getAverageTimePositionsHeldForFund }
            />
          :null
        }
        
        {
          // fund positions information
          !_.get(results, 'companySearchResult.status', -1)?
            <ResultsGetPositionsForFund
              results={ results.companySearchResult }
            />
          :null
        }
        
        {
          // company holders information
          !_.get(results, 'symbolSearchResult.status', -1)?
            <ResultsGetHoldersForTicker
              results={ results.symbolSearchResult }
            />
          :null
        }
      </div>
    );
  }
};

const styles = {
  container: {
    margin: 20
  }
};
