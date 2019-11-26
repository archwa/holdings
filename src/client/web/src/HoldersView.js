import React from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function TablePaginationActions(props) {
  const useStyles1 = makeStyles(theme => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }));

  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

// need CUSIP
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            style={{ minWidth: headCell.minWidth, fontFamily: 'Courier New' }}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/*orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null*/}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.object.isRequired,
};


export class HoldersView extends React.Component {

  constructor(props) {
    super(props);
    

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._getHolders = this._getHolders.bind(this);
    this._handleChange = this._handleChange.bind(this);

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
      'currentOnly': false,
      'tableDense': false,
      'order': 'asc',
      'orderBy': 'name',
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

  _handleChange(event, type) {
    if(type === 'current_only') {
      this.setState({
        'currentOnly': event.target.checked
      });  
    }

    if(type === 'table_density') {
      this.setState({
        'tableDense': event.target.checked
      });  
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

          if(_.isEmpty(modifiedHoldings)) {
            modifiedHoldings = null;
          }

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

    const order = this.state.order;
    const orderBy = this.state.orderBy;

    const handleRequestSort = (event, property) => {
      const isDesc = orderBy === property && order === 'desc';
      this.setState({ order: isDesc ? 'asc' : 'desc' });
      this.setState({ orderBy: property });
    };

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

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentQuarter = ~~((date.getMonth() + 1) / 3) + 1;

    const currentOnly = this.state.currentOnly;

    let holders = _.filter(this.state.holders, holder => holder['name'] && holder['cik'] && holder['cusip9']);
    if(currentOnly) {
      holders = _.filter(holders, holder => {
        const holderYear = parseInt(_.get(holder, 'to', '0000q0').substring(0, 4));
        const holderQuarter = parseInt(_.get(holder, 'to', '0000q0').substring(5, 6));

        if(!Math.abs(currentYear - holderYear)) {
          return Math.abs(currentQuarter - holderQuarter) <= 1;
        }
        
        return Math.abs(currentYear - holderYear) === 1 && currentQuarter === 1 && holderQuarter === 4;
      });
    }

    

    const cusip = this.state.cusip;
    let avgOwnership = 0;

    if(holders && holders.length) {
      avgOwnership = _.reduce(_.map(holders, holder => holder.ownership_length), (acc, num) => {
        return acc + num;
      }, 0) / holders.length;
      avgOwnership = Math.round(avgOwnership * 1000) / 1000;
    }

    const issuer_name = _.get(this.state, 'issuer_names.0', null);
    const tableDense = this.state.tableDense;
    
    return (
      <>
        { loading? <><div style={{ minHeight: '30vh' }}></div>One moment please ...</> :null}
        { (!loading && !holders)? <><div style={{ minHeight: '30vh' }}></div>{ `No results for requested CUSIP "${cusip}"!` }</> :null}
        { loading || !holders? null :
        <>
        <div style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: 'raleway'}}>
          <h1>{ issuer_name }</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', margin: '10px' }}>
          <div>
          Dense table padding
          <Checkbox
            checked={tableDense}
            onChange={(event) => this._handleChange(event, 'table_density')}
            color="primary"
          /></div>
          <div>
          Show current holders only <Checkbox
            checked={currentOnly}
            onChange={(event) => this._handleChange(event, 'current_only')}
            color="primary"
          /></div>
          <div style={{ fontFamily: 'Courier New' }}><strong>Average Ownership Length</strong>: { avgOwnership } quarters ({Math.round(1000 * avgOwnership / 4)/1000} years)</div>
        </div>
        <Paper className={classes.root} style={{ display: 'block', width: '100%' }}>
          <div className={classes.tableWrapper}>
            <Table size={ tableDense? 'small' :'medium' } stickyHeader aria-label="sticky table">
              { /*<TableHead>
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
              </TableHead> */ }
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headCells={columns}
              />
              <TableBody>
                {!holders? null : stableSort(holders, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.key}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ fontFamily: 'Courier New' }}>
                            {
                              (() => {
                                if(column.id === 'name') {
                                  return <Link style={{ textDecoration: 'none', color: 'blue' }} to={ '/holdings/' + row.cik }>{ value }</Link>;
                                }

                                return column.format && typeof value === 'number' ? column.format(value) : value;
                              })()
                            }
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
            ActionsComponent={TablePaginationActions}
          />
        </Paper>
        </>
        }
      </>
    );
  }

};
