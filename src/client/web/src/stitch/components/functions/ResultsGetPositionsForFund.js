import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

export class ResultsGetPositionsForFund extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      column: null,
      direction: null,
      data: this.props.results.data,
      rawResults: this.props.results,
    };
  }

  // update raw results from props
  componentDidUpdate() {
    if(!_.isEqual(this.props.results, this.state.rawResults)) {
      this.setState({
        data: this.props.results.data,
        rawResults: this.props.results,
      });
    } 
  }

  _handleSort = (clickedColumn) => () => {
    const { column, direction } = this.state;

    // sort by ascending if not clicked
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        direction: 'ascending',
        data: _.sortBy(this.state.data, [ clickedColumn ])
      });
    }

    // if clicked, toggle sort direction
    else {
      this.setState({
        direction: direction === 'ascending' ? 'descending' : 'ascending',
        data: this.state.data.reverse()
      });
    }
  }

  render() {
    const { column, direction, data } = this.state;
    const columnNames = [ 'cusip', 'from', 'to', 'quarters' ];
    const columnNameDisplay = {
      'cusip': 'CUSIP',
      'from': 'From',
      'to': 'To',
      'quarters': 'Quarters'
    };

    return (
      // name the div here? TODO
      <div style={ styles.container }>
        <Table>
          <TableHead>
            <TableRow>
              {
                _.map(columnNames, name => (
                  <TableCell
                    key={ name }
                    sorted={ column === name? direction :null }
                    onClick={ this._handleSort(name) }
                  >
                    { columnNameDisplay[name] }
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              _.map(data, ({ cusip, from, to, quarters }, idx) => (
                  <TableRow key={ _.join([cusip, '-', idx], '') }>
                    <TableCell><code>{ cusip }</code></TableCell>
                    <TableCell><code>{ from }</code></TableCell>
                    <TableCell><code>{ to }</code></TableCell>
                    <TableCell><code>{ quarters }</code></TableCell>
                  </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }

};

const styles = {
  container: {
    margin: 20
  }
};