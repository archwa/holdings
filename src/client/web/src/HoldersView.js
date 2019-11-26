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

// need CUSIP


export class HoldersView extends React.Component {

  constructor(props) {
    super(props);
    

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._getHolders = this._getHolders.bind(this);

    const initialCusipFromPath = _.get(this.props, 'match.params.cusip', null);
    const initialCusipFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'cusip', null);
    const initialCusip = initialCusipFromPath? initialCusipFromPath :initialCusipFromQuery;

    // initialize state
    this.state = {
      'holders': null,
      'cusip': initialCusip,
      'loading': true,
      'tableInfo': {
        'page': 0,
        'rowsPerPage': 10
      },
    };
  }

  componentDidMount() {
    const cusip = this.state.cusip;

    if(this.props.stitchInitialized && cusip) {
      this._getHolders(cusip);
    }

    else if(this.props.stitchInitialized && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.stitchInitialized) {
      const cusipFromPath = _.get(this.props, 'match.params.cusip', null);
      const oldCusipFromPath = _.get(prevProps, 'match.params.cusip', null);
      const cusipFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'cusip', null);
      const oldCusipFromQuery = _.get(queryString.parse(_.get(prevProps, 'location.search', null)), 'cusip', null);

      if(cusipFromPath || cusipFromQuery) {
        let cusip, oldCusip;

        if(cusipFromPath) {
          cusip = cusipFromPath;
          oldCusip = oldCusipFromPath;
        }

        else if(cusipFromQuery) {
          cusip = cusipFromQuery;
          oldCusip = oldCusipFromQuery;
        }

        if(cusip !== oldCusip) {
          this._getHolders(cusip);
        }
      }
    }
  }

  _getHolders(cusip) {
    const strCusip = cusip.toString();

    if(strCusip.length >= 6) {
      const cusip6 = cusip.substr(0, 6);
      this.stitch.callFunction('getHoldersForIssuer', [ cusip6 ])
        .then(res => {
          const holdings = _.get(res, 'data.holdings', null);
          let modifiedHoldings;
          
          if(holdings) {
            modifiedHoldings = _.map(holdings, (holding, index) => ({
              'name': _.get(holding, 'filer_names.0', null),
              'cik': _.get(holding, 'cik', null),
              'cusip9': _.get(holding, 'cusip9', null),
              'from': _.get(holding, 'from.year') + 'q' + _.get(holding, 'from.quarter'),
              'to': _.get(holding, 'to.year') + 'q' + _.get(holding, 'to.quarter'),
              'ownership_length': _.get(holding, 'ownership_length'),
              'key': _.get(holding, 'cik', '') + index.toString()
            }));
          }

          console.log(res);
          this.setState({
            'holders': modifiedHoldings,
            'loading': false,
            'issuer_names': _.get(res, 'data.issuer_names', null)
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
        'cusip': strCusip,
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
      { id: 'name', label: 'Holder Name', minWidth: 170 },
      /*{ id: 'cik', label: 'CIK', minWidth: 100 },
      {
        id: 'cusip9',
        label: 'CUSIP9',
        minWidth: 170,
        format: value => value.toLocaleString(),
      },*/
      {
        id: 'from',
        label: 'From',
        minWidth: 70,
        format: value => value.toLocaleString(),
        align: 'right'
      },
      {
        id: 'to',
        label: 'To',
        minWidth: 70,
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
    const holders = _.filter(this.state.holders, holder => holder['name'] && holder['cik'] && holder['cusip9']);
    const cusip = this.state.cusip;
    let avgOwnership;

    if(holders && holders.length) {
      avgOwnership = _.reduce(_.map(holders, holder => holder.ownership_length), (acc, num) => {
        return acc + num;
      }, 0) / holders.length;
      avgOwnership = Math.round(avgOwnership * 1000) / 1000;
    }

    const issuer_name = _.get(this.state, 'issuer_names.0', null);
    
    return (
      <>
        
          { loading? <><div style={{ minHeight: '30vh' }}></div>One moment please ...</> :null}
          { (!loading && (!holders || !holders.length)) ? <><div style={{ minHeight: '30vh' }}></div>{ `No results for requested CUSIP "${cusip}"!` }</> :null}
        { (!holders || !holders.length)? null :
        <>
        <div style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: 'raleway'}}>
          <h1>{ issuer_name }</h1>
        </div>
        <div style={{ display: 'block', fontFamily: 'Courier New', textAlign: 'left', margin: '10px' }}>
          <strong>Average length of ownership</strong>: { avgOwnership } quarters ({avgOwnership / 4} years)
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
                {!holders? null : holders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.key}>
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
            count={!holders? 0 :holders.length}
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
