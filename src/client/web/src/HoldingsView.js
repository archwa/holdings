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
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';

// need CIK

const styles = {
  'textField': {
    margin: '5px',
    width: '30%',
    minWidth: '300px',
    display: 'inline-block',
    position: '',
    bottom: 0
  },
};

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
  const { order, orderBy, onRequestSort, headCells } = props;
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.object.isRequired,
};

export class HoldingsView extends React.Component {

  constructor(props) {
    super(props);
    

    // get Stitch controller from props
    this.stitch = this.props.stitch;

    // bind this to all non-React functions
    this._getHoldings = this._getHoldings.bind(this);
    this._handleChange = this._handleChange.bind(this);

    const initialCikFromPath = _.get(this.props, 'match.params.cik', null);
    const initialCikFromQuery = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'cik', null);
    const initialCik = initialCikFromPath? initialCikFromPath :initialCikFromQuery;
    const autoRedir = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'autoRedir', false);
    const query = _.get(queryString.parse(_.get(this.props, 'location.search', null)), 'q', null);

    // initialize state
    this.state = {
      'holdings': null,
      'cik': initialCik,
      'loading': true,
      'tableInfo': {
        'page': 0,
        'rowsPerPage': 10
      },
      'currentOnly': false,
      'order': 'desc',
      'orderBy': 'ownership_length',
      'filter': '',
      'autoRedir': autoRedir,
      'query': query,
    };
  }

  componentDidMount() {
    const cik = this.state.cik;

    if(this.props.stitchInitialized && cik) {
      this._getHoldings(cik);
    }

    else if(this.props.stitchInitialized && this.state.loading) {
      this.setState({ loading: false });
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

  _handleChange(event, type) {
    if(type === 'current_only') {
      this.setState({
        'currentOnly': event.target.checked
      });  
    }

    if(type === 'filter') {
      this.setState({
        'filter': event.target.value
      });
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
              'name': _.get(holding, 'issuer_names.0', null),
              'cusip6': _.get(holding, 'cusip6', null),
              'cusip9': _.get(holding, 'cusip9', null),
              'from': _.get(holding, 'from.year') + 'q' + _.get(holding, 'from.quarter'),
              'to': _.get(holding, 'to.year') + 'q' + _.get(holding, 'to.quarter'),
              'ownership_length': _.get(holding, 'ownership_length'),
              'key': _.get(holding, 'cusip6', '') + index.toString()
            }));
          }

          if(_.isEmpty(modifiedHoldings)) {
            modifiedHoldings = null;
          }

          this.setState({
            'holdings': modifiedHoldings,
            'loading': false,
            'filer_names': _.get(res, 'data.filer_names', null)
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
        minWidth: 70,
        align: 'right'
      },
    ];


    const rowsPerPage = this.state.tableInfo.rowsPerPage;
    const page = this.state.tableInfo.page;
    const loading = this.state.loading;

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentQuarter = ~~((date.getMonth() + 1) / 3) + 1;

    const currentOnly = this.state.currentOnly;

    let holdings = _.filter(this.state.holdings, holding => holding['name'] && holding['cusip6'] && holding['cusip9']);
    if(currentOnly) {
      holdings = _.filter(holdings, holding => {
        const holdingYear = parseInt(_.get(holding, 'to', '0000q0').substring(0, 4));
        const holdingQuarter = parseInt(_.get(holding, 'to', '0000q0').substring(5, 6));

        if(!Math.abs(currentYear - holdingYear)) {
          return Math.abs(currentQuarter - holdingQuarter) <= 1;
        }
        
        return Math.abs(currentYear - holdingYear) === 1 && currentQuarter === 1 && holdingQuarter === 4;
      });
    }

    const filterValue = this.state.filter;

    if(!_.isEmpty(filterValue)) {
      const filterValueLower = _.lowerCase(filterValue.toString());
      const colKeys = _.map(columns, column => column.id);
      holdings = _.filter(holdings, holding => {
        const slimHolding = _.pick(holding, colKeys);
        return _.map(_.values(slimHolding), value => _.includes(_.lowerCase(value.toString()), filterValueLower)).some(a => a)
      });
    }


    const cik = this.state.cik;
    let avgOwnership = 0;

    if(holdings && holdings.length) {
      avgOwnership = _.reduce(_.map(holdings, holding => holding.ownership_length), (acc, num) => {
        return acc + num;
      }, 0) / holdings.length;
      avgOwnership = Math.round(avgOwnership * 1000) / 1000;
    }

    const filer_name = _.get(this.state, 'filer_names.0', null);

    const autoRedir = this.state.autoRedir;
    const query = this.state.query;
    const parsedQuery = {
      'q': query,
      'fromSearch': false
    };
    const qs = queryString.stringify(parsedQuery);
    
    return (
      <>
        { loading? <><div style={{ minHeight: '30vh' }}></div>One moment please ...</> :null}
        { (!loading && !holdings)? <><div style={{ minHeight: '30vh' }}></div>{ `No results for requested CIK "${cik}"!` }</> :null}
        { loading || !holdings? null :
        <>
        <div style={{ display: 'block', width: '100%', textAlign: 'center' }}>
          { autoRedir && query?
            <div>
              You were automatically redirected from search.  Click <Link style={{ textDecoration: 'none', color: 'blue' }} to={ '/search?' + qs }>here</Link> to view full results.
            </div> :null }
          <h1>{ filer_name }</h1>
        </div>
        <Paper className={classes.root} style={{ display: 'block', width: '100%' }}>
          <div className={classes.tableWrapper}>
            <Table size='small' stickyHeader aria-label="sticky table">
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
                {!holdings? null : stableSort(holdings, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.key}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ fontFamily: 'Courier New' }}>
                            {
                              (() => {
                                if(column.id === 'name') {
                                  return <Link style={{ textDecoration: 'none', color: 'blue' }} to={ '/holders/' + row.cusip6 }>{ value }</Link>;
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
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={ columns.length - 2}>
                    <TextField
                      onChange={(event) => this._handleChange(event, 'filter')}
                      /*label='Filter'*/
                      /*variant='filled'*/
                      placeholder='Filter'
                      type='search'
                      value={ filterValue }
                      style={ styles.textField }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell style={{ fontFamily: 'Courier New' }}>
                    <Checkbox
                      checked={currentOnly}
                      onChange={(event) => {
                        this._handleChange(event, 'current_only');
                        handleChangePage(event, 0);
                      }}
                      color="primary"
                    /> Show current holdings only 
                  </TableCell>
                  <TableCell style={{ textAlign: 'right', fontFamily: 'Courier New' }}>
                    <strong>Average</strong>: { avgOwnership } quarters ({Math.round(1000 * avgOwnership / 4)/1000} years)
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={!holdings? 0 :holdings.length}
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
