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
      console.log('new company query');
    }

    if(symbolSearch !== oldSymbolSearch) {
      this.setState({ 'symbolQuery': symbolSearch, 'symbolResults': null });
      console.log('new symbol query');
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

        console.log(res);
        this.setState({ loading: false, companyResults: companyResults });
      });
  }

  _searchSymbol(q) {
    this.setState({ loading: true });
    this.stitch.callFunction('searchForSymbol', [ q ])
      .then(res => {
        console.log(res);
        this.setState({ loading: false, symbolResults: q });
      });
  }

  render() {
    const loading = this.state.loading;
    const companyResults = this.state.companyResults;
    const symbolResults = this.state.symbolResults;
    const companyQuery = this.state.companyQuery;
    const symbolQuery = this.state.symbolQuery;

    return (<div>
      { (!loading && !companyResults && !symbolResults)? <><div style={{ minHeight: '30vh' }}></div>{ `Please provide a search query.` }</> :null}
      { (loading && (companyQuery || symbolQuery))? <><div style={{ minHeight: '30vh' }}></div>{ `One moment please ...` }</> :null}
      { (companyResults && !loading)?
      <div style={{ textAlign: 'left' }}>
        <ul>
          { 
            _.reduce(companyResults, (acc, val, k) => {
              const item = <li key={ k.toString() }>
                  { k.toString() + ' : ' }
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
                </li>;

              return _.concat(acc, item);
            }, [])
          }
        </ul>
      </div>
      :null }
    </div>);
  }

};
