import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import { Link } from 'react-router-dom';

export class SearchResults extends React.Component {

  constructor(props) {
    super(props);

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._searchCompany = this._searchCompany.bind(this);
    this._searchSymbol = this._searchSymbol.bind(this);

    const initialCompanySearchFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'company', null);
    const initialSymbolSearchFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'symbol', null);
    
    this.state = {
      'companyQuery': initialCompanySearchFromQuery,
      'symbolQuery': initialSymbolSearchFromQuery,
      'companyResults': null,
      'symbolResults': null,
      'loading': true,
    };
  }

  componentDidMount() {
    const stitchInitialized = this.props.stitchInitialized;
    const companyQuery = this.state.companyQuery;
    const symbolQuery = this.state.symbolQuery;

    if(stitchInitialized && companyQuery) {
      this._searchCompany(companyQuery);
    }

    if(stitchInitialized && symbolQuery) {
      this._searchSymbol(symbolQuery);
    }

    if(stitchInitialized && !companyQuery && !symbolQuery && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  componentDidUpdate(prevProps) {
    const stitchInitialized = this.props.stitchInitialized;
    const companySearch = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'company', null);
    const oldCompanySearch = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'company', null);
    const symbolSearch = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'symbol', null);
    const oldSymbolSearch = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'symbol', null);

    // clear old searches
    if(companySearch !== oldCompanySearch) {
      this.setState({ 'companyQuery': companySearch, 'companyResults': null });
    }

    if(symbolSearch !== oldSymbolSearch) {
      this.setState({ 'symbolQuery': symbolSearch, 'symbolResults': null });
    }


    // perform new searches
    if(stitchInitialized && companySearch && companySearch !== oldCompanySearch) {
      this._searchCompany(companySearch);
    }
    
    if(stitchInitialized && symbolSearch && symbolSearch !== oldSymbolSearch) {
      this._searchSymbol(symbolSearch);
    }
  }

  _searchCompany(q) {
    this.setState({ loading: true });
    this.stitch.callFunction('searchForCompany', [ q ])
      .then(res => {
        const filerData = _.get(res, 'data.filerSearch.data', null);
        const issuerData = _.get(res, 'data.issuerSearch.data', null);

        let filerResults, issuerResults;

        if(issuerData.count !== 1) {
          issuerResults = _.map(issuerData.results, issuer => ({
            name: _.get(issuer, 'names.0', null),
            cusip6: _.get(issuer, 'cusip6', null),
          }));
        }

        else {
          issuerResults = [
            {
              name: _.get(issuerData, 'results.data.issuer_names.0', null),
              cusip6: _.get(issuerData, 'results.data.issuer_cusip6', null),
            }
          ];
        }

        if(filerData.count !== 1) {
          filerResults = _.map(filerData.results, filer => ({
            name: _.get(filer, 'name', null),
            cik: _.get(filer, 'cik', null),
          }));
        }

        else {
          filerResults = [
            {
              name: _.get(filerData, 'results.data.filer_names.0', null),
              cik: _.get(filerData, 'results.data.filer_cik', null),
            }
          ];
        }
        
        const holders = _.reduce(issuerResults, (acc, issuerResult) => {
          const newAcc = acc;
          const issuerName = _.get(issuerResult, 'name', null);
          if(!newAcc[issuerName]) {
            newAcc[issuerName] = {
              'holders': _.get(issuerResult, 'cusip6', null)
            };
          }

          else if(!newAcc[issuerName]['holders']) {
            newAcc[issuerName]['holders'] = _.get(issuerResult, 'cusip6', null);
          }

          return newAcc;
        }, {});

        const filers = _.reduce(filerResults, (acc, filerResult) => {
          const newAcc = acc;
          const filerName = _.get(filerResult, 'name', null);
          if(!newAcc[filerName]) {
            newAcc[filerName] = {
              'holdings': _.get(filerResult, 'cik', null)
            };
          }

          else if(!newAcc[filerName]['holdings']) {
            newAcc[filerName]['holdings'] = _.get(filerResult, 'cik', null);
          }

          return newAcc;
        }, {});

        const companyResults = _.merge(holders, filers);

        this.setState({ loading: false, companyResults });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  _searchSymbol(q) {
    this.setState({ loading: true });
    this.stitch.callFunction('searchForSymbol', [ q ])
      .then(res => {
        // no results
        if(!res.status && !res.data) {
          this.setState({ loading: false, symbolResults: null });
        }

        else {
          const data = _.get(res, 'data', null);
          const symbolName = _.get(data, 'symbol.symbol', null);
          const holdersView = _.get(data, 'holdersView', null);
          const holdingsView = _.get(data, 'holdingsView', null);
          const holdings = holdingsView? {
            'name': _.get(holdingsView, 'data.filer_names.0', null),
            'cik': _.get(holdingsView, 'data.filer_cik', null),
          } :null;
          const holders = holdersView? {
            'name': _.get(holdersView, 'data.issuer_names.0', null),
            'cusip6': _.get(holdersView, 'data.issuer_cusip6', null),
          } :null;

          const name = holdings? holdings.name :(holders? holders.name :symbolName);

          const symbolResults = {
            name,
            symbol: symbolName,
            holdings: holdings? _.get(holdings, 'cik', null) :null,
            holders: holders? _.get(holders, 'cusip6', null) :null,
          };

          this.setState({ loading: false, symbolResults });
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  render() {
    const loading = this.state.loading;
    const companyResults = this.state.companyResults;
    const symbolResults = this.state.symbolResults;
    const companyQuery = this.state.companyQuery;
    const symbolQuery = this.state.symbolQuery;

    return (<div>
      { (!loading && !companyQuery && !symbolQuery)? <><div style={{ minHeight: '30vh' }}></div>{ `Please provide a search query.` }</> :null}
      { (!loading && (companyQuery || symbolQuery) && _.isEmpty(companyResults) && _.isEmpty(symbolResults))?
        <>
          <div style={{ minHeight: '30vh' }}></div>
          {
            (() => {
              let noResults = 'No results';
              if(companyQuery) {
                noResults += ` for company query "${companyQuery}"`
              }
              if(companyQuery && symbolQuery) {
                noResults += ' or';
              }
              if(symbolQuery) {
                noResults += ` for symbol query "${symbolQuery}"`;
              }
              noResults += '.';

              return noResults;
            })()
          }
        </> :null}
      { (loading && (companyQuery || symbolQuery))? <><div style={{ minHeight: '30vh' }}></div>{ `One moment please ...` }</> :null}
      { (!_.isEmpty(companyResults) && !loading)?
      <div style={{ textAlign: 'left', margin: '10px' }}>
        <h2>Company Results</h2>
        <ul>
          { 
            _.reduce(companyResults, (acc, val, k) => {
              const item = <li key={ k.toString() }>
                  <strong>{ k.toString() }</strong>
                  { ' : ' }
                  { !val.holders? null :
                    <Link to={ '/holders/' + val.holders.toString() }>
                      Holders
                    </Link>
                  }
                  { val.holders && val.holdings? ' | ' :null}
                  { !val.holdings? null :
                    <Link to={ '/holdings/' + val.holdings.toString() }>
                      Holdings
                    </Link>
                  }
                  {!val.holders && !val.holdings? 'No holders or holdings views available.' :null}
                </li>;

              return _.concat(acc, item);
            }, [])
          }
        </ul>
      </div>
      :null }
      { (!_.isEmpty(symbolResults) && !loading)?
      <div style={{ textAlign: 'left', margin: '10px' }}>
        <h2>Symbol Results</h2>
        <ul>
          { (() => {
              const name = _.get(symbolResults, 'name', null);
              const symbol = _.get(symbolResults, 'symbol', null);
              const holders = _.get(symbolResults, 'holders', null);
              const holdings = _.get(symbolResults, 'holdings', null);

              return <li key={ name }>
                <strong>{ name + ' ( ' + symbol + ' )' }</strong>
                { ' : ' }
                { !holders? null :
                  <Link to={ '/holders/' + holders }>
                    Holders
                  </Link>
                }
                {holders && holdings? ' | ' :null}
                { !holdings? null :
                  <Link to={ '/holdings/' + holdings }>
                    Holdings
                  </Link>
                }
                {!holders && !holdings? 'No holders or holdings views available.' :null}
              </li>;
            })()
          }
        </ul>
      </div>
      :null}
    </div>);
  }

};
