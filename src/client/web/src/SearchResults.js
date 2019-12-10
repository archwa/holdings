import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import { Link, Redirect } from 'react-router-dom';

export class SearchResults extends React.Component {

  constructor(props) {
    super(props);

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._searchCompany = this._searchCompany.bind(this);
    this._searchSymbol = this._searchSymbol.bind(this);

    const initialSearchFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'q', null);
    const fromSearch = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'fromSearch', false) === 'true'? true :false;
    
    this.state = {
      'searchQuery': initialSearchFromQuery,
      'companyResults': null,
      'symbolResults': null,
      'loading': true,
      'loadingCompanyResults': false,
      'loadingSymbolResults': false,
      'redirect': {
        go: false,
        location: '/',
      },
      'fromSearch': fromSearch
    };
  }

  componentDidMount() {
    const stitchInitialized = this.props.stitchInitialized;
    const searchQuery = this.state.searchQuery;

    if(stitchInitialized && searchQuery) {
      this._searchCompany(searchQuery);
      this._searchSymbol(searchQuery);
    }

    if(stitchInitialized && !searchQuery && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  componentDidUpdate(prevProps) {
    const stitchInitialized = this.props.stitchInitialized;
    const search = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'q', null);
    const oldSearch = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'q', null);

    const fromSearch = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'fromSearch', false) === 'true'? true :false;
    const oldFromSearch = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'fromSearch', false) === 'true'? true :false;

    

    // clear old searches
    if(search !== oldSearch) {
      this.setState({
        'searchQuery': search,
        'companyResults': null,
        'symbolResults': null
      });
    }

    if(fromSearch !== oldFromSearch) {
      this.setState({ 'fromSearch': fromSearch });
    }

    // perform new searches
    if(stitchInitialized && search && search !== oldSearch) {
      this._searchCompany(search);
      this._searchSymbol(search);
    }
  }

  _searchCompany(q) {
    this.setState({ loading: true, loadingCompanyResults: true });
    this.stitch.callFunction('searchForCompany', [ q ])
      .then(res => {
        if(res.data.filerSearch.status < 0) {
          console.error(res.data.filerSearch.message);
        }

        if(res.data.issuerSearch.status < 0) {
          console.error(res.data.issuerSearch.message);
        }

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

        const companyResultsValues = _.values(companyResults);

        if(companyResultsValues.length === 1) {
          const company = _.first(companyResultsValues);
          const companyKeys = _.keys(company);

          if(companyKeys.length === 1 && this.state.fromSearch) {
            const loc = _.first(companyKeys).toString();
            const id = _.get(company, loc).toString();

            const newQuery = {
              'autoRedir': true,
              q
            };

            const qs = queryString.stringify(newQuery);

            let newRedirect = { ...this.state.redirect };
            newRedirect.location = '/' + loc + '/' + id + (qs? '?' + qs :'');
            newRedirect.go = true;

            this.setState({ redirect: newRedirect });  
          }

          else {
            this.setState({ loading: false, loadingCompanyResults: false, companyResults });
          }
        }

        else {
          this.setState({ loading: false, loadingCompanyResults: false, companyResults });
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, loadingCompanyResults: false });
      });
  }

  _searchSymbol(q) {
    this.setState({ loading: true, loadingSymbolResults: true });
    this.stitch.callFunction('searchForSymbol', [ q ])
      .then(res => {
        // no results
        if(!res.status && !res.data) {
          this.setState({ loading: false, symbolResults: null });
        }

        if(res.status < 0) {
          console.error(res.message);
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

          if(symbolResults.holdings && !symbolResults.holders && this.state.fromSearch) {
            const newQuery = {
              'autoRedir': true,
              q
            };

            const qs = queryString.stringify(newQuery);

            let newRedirect = { ...this.state.redirect };
            newRedirect.location = ('/holdings/' + symbolResults.holdings.toString() + (qs? '?' + qs :''));
            newRedirect.go = true;

            this.setState({ redirect: newRedirect });  
          }
          
          else if(!symbolResults.holdings && symbolResults.holders && this.state.fromSearch) {
            const newQuery = {
              'autoRedir': true,
              q
            };

            const qs = queryString.stringify(newQuery);

            let newRedirect = { ...this.state.redirect };
            newRedirect.location = ('/holders/' + symbolResults.holders.toString() + (qs? '?' + qs :''));
            newRedirect.go = true;

            this.setState({ redirect: newRedirect });  
          }
          
          else {
            this.setState({ loading: false, loadingSymbolResults: false, symbolResults });
          }
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, loadingSymbolResults: false });
      });
  }

  render() {
    const loading = this.state.loading || this.state.loadingCompanyResults || this.state.loadingSymbolResults;
    const companyResults = this.state.companyResults;
    const symbolResults = this.state.symbolResults;
    const searchQuery = this.state.searchQuery;

    const redirect = this.state.redirect.go;
    const location = this.state.redirect.location;

    const symResFlag = symbolResults && (!_.isEmpty(symbolResults.holdings) || !_.isEmpty(symbolResults.holders));

    return (<div>
      { redirect? <Redirect to={ location } /> :null }
      { (!loading && !searchQuery)? <><div style={{ minHeight: '30vh' }}></div>{ `Please provide a search query.` }</> :null}
      { (!loading && searchQuery && _.isEmpty(companyResults) && !symResFlag)?
        <>
          <div style={{ minHeight: '30vh' }}></div>
          { `No results for search query "${searchQuery}".` }
        </> :null}
      { (loading && searchQuery)? <><div style={{ minHeight: '30vh' }}></div>{ `One moment please ...` }</> :null}
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
      { (symResFlag && !loading)?
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
