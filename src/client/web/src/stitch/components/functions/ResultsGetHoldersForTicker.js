import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

export class ResultsGetHoldersForTicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      column: null,
      direction: null,
      data: this.props.results.data,
      rawData: this.props.results.data
    };
  }

  // update raw results from props
  componentDidUpdate() {
    if(!_.isEqual(this.props.results.data, this.state.rawData)) {
      this.setState({
        data: this.props.results.data,
        rawData: this.props.results.data,
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
    const columnNames = [ 'name', 'cik', 'from', 'to', 'quarters' ];
    const columnNameDisplay = {
      'name': 'Name',
      'cik': 'CIK',
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
              _.map(data, ({ name, cik, from, to, quarters }, idx) => (
                  <TableRow key={ _.join([cik, '-', idx], '') }>
                    <TableCell><code>{ name }</code></TableCell>
                    <TableCell><code>{ cik }</code></TableCell>
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
