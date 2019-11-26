import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

// need CIK


export class HoldingsView extends React.Component {

  constructor(props) {
    super(props);
    

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._getHoldings = this._getHoldings.bind(this);

    const initialCikFromPath = _.get(this.props, 'match.params.cik', null);
    const initialCikFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'cik', null);
    const initialCik = initialCikFromPath? initialCikFromPath :initialCikFromQuery;

    // initialize state
    this.state = {
      'holdings': null,
      'cik': initialCik,
      'loading': true,
      'tableInfo': {
        'page': 0,
        'rowsPerPage': 10
      },
    };
  }

  componentDidMount() {
    const cik = this.state.cik;

    if(this.props.stitchInitialized && cik) {
      this._getHoldings(cik);
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.stitchInitialized) {
      const cikFromPath = _.get(this.props, 'match.params.cik', null);
      const oldCikFromPath = _.get(prevProps, 'match.params.cik', null);
      const cikFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'cik', null);
      const oldCikFromQuery = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'cik', null);

      if(cikFromPath || cikFromQuery) {
        let cik, oldCik;

        if(cikFromPath) {
          cik = cikFromPath;
          oldCik = oldCikFromPath;
        }

        else if(cikFromQuery) {
          cik = cikFromQuery;
          oldCik = oldCikFromQuery;
        }

        if(cik !== oldCik) {
          this._getHoldings(cik);
        }
      }
    }
  }

  _getHoldings(cik) {
    const strCik = cik.toString();

    if(strCik.length <= 10) {
      const cik = strCik.padStart(10, '0');
      this.stitch.callFunction('getHoldingsForFiler', [ cik ])
        .then(res => {
          const holdings = _.get(res, 'data.holdings', null);
          let modifiedHoldings;
          
          if(holdings) {
            modifiedHoldings = _.map(holdings, (holding, index) => ({
              'name': _.get(holding, 'issuer_names', ['null'])[0],
              'cusip6': _.get(holding, 'cusip6', null),
              'cusip9': _.get(holding, 'cusip9', null),
              'from': _.get(holding, 'from.year') + 'q' + _.get(holding, 'from.quarter'),
              'to': _.get(holding, 'to.year') + 'q' + _.get(holding, 'to.quarter'),
              'ownership_length': _.get(holding, 'ownership_length'),
              'key': _.get(holding, 'cusip6', '') + index.toString()
            }));
          }

          console.log(res);
          this.setState({
            'holdings': modifiedHoldings,
            'loading': false,
            'filer_names': _.get(res, 'data.filer_names', null)
            //'
          });
        })
        .catch(err => {
          this.setState({
            'loading': false,
          });
          console.error(err);
        });
    }

    else {
      this.setState({
        'loading': false,
        'cik': strCik,
      });
    }
  }


  render() {
    const classes = makeStyles({
      root: {
        width: '100%',
      },
      tableWrapper: {
        maxHeight: 440,
        overflow: 'auto',
      },
    });

    const columns = [
      { id: 'name', label: 'Issuer Name', minWidth: 170 },
      /*{ id: 'cik', label: 'CIK', minWidth: 100 },
      {
        id: 'cik9',
        label: 'CIK9',
        minWidth: 170,
        format: value => value.toLocaleString(),
      },*/
      {
        id: 'from',
        label: 'From',
        minWidth: 170,
        format: value => value.toLocaleString(),
        align: 'right'
      },
      {
        id: 'to',
        label: 'To',
        minWidth: 170,
        align: 'right'
      },
      {
        id: 'ownership_length',
        label: 'Ownership Length (Quarters)',
        minWidth: 170,
        align: 'right'
      },
    ];

    const handleChangePage = (event, newPage) => {
      const tableInfo = this.state.tableInfo;
      tableInfo.page = newPage;
      this.setState({ tableInfo });
    };

    const handleChangeRowsPerPage = event => {
      const tableInfo = this.state.tableInfo;
      tableInfo.page = 0;
      tableInfo.rowsPerPage = +event.target.value; // number conversion, unary '+'
      this.setState({ tableInfo });
    };

    const rowsPerPage = this.state.tableInfo.rowsPerPage;
    const page = this.state.tableInfo.page;
    const loading = this.state.loading;
    const holdings = this.state.holdings;
    const cik = this.state.cik;
    let avgOwnership;

    if(holdings && holdings.length) {
      avgOwnership = _.reduce(_.map(holdings, holding => holding.ownership_length), (acc, num) => {
        return acc + num;
      }, 0) / holdings.length;
      avgOwnership = Math.round(avgOwnership * 1000) / 1000;
    }

    const filer_name = _.get(this.state, 'filer_names.0', null);
    
    return (
      <>
        
          { loading? <><div style={{ minHeight: '30vh' }}></div>Processing request ...</> :null}
          { (!loading && (!holdings || !holdings.length)) ? <><div style={{ minHeight: '30vh' }}></div>{ `No results for requested CIK "${cik}"!` }</> :null}
        { (!holdings || !holdings.length)? null :
        <>
        <div style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: 'raleway'}}>
          <h1>{ filer_name }</h1>
        </div>
        <div style={{ display: 'block', fontFamily: 'Courier New', textAlign: 'left', margin: '10px' }}>
          <strong>Average ownership</strong>: { avgOwnership } quarters ({avgOwnership / 4} years)
        </div>
        <Paper className={classes.root} style={{ display: 'block', width: '100%' }}>
          <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontFamily: 'Courier New' }}
                    >
                      <strong>{column.label}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!this.state.holdings? null : this.state.holdings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ fontFamily: 'Courier New' }}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={!this.state.holdings? 0 :this.state.holdings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        </>
        }
      </>
    );
  }

};
