import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

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
        <Table sortable celled>
          <Table.Header>
            <Table.Row>
              {
                _.map(columnNames, name => (
                  <Table.HeaderCell
                    key={ name }
                    sorted={ column === name? direction :null }
                    onClick={ this._handleSort(name) }
                  >
                    { columnNameDisplay[name] }
                  </Table.HeaderCell>
                ))
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              _.map(data, ({ cusip, from, to, quarters }, idx) => (
                  <Table.Row key={ _.join([cusip, '-', idx], '') }>
                    <Table.Cell><code>{ cusip }</code></Table.Cell>
                    <Table.Cell><code>{ from }</code></Table.Cell>
                    <Table.Cell><code>{ to }</code></Table.Cell>
                    <Table.Cell><code>{ quarters }</code></Table.Cell>
                  </Table.Row>
              ))
            }
          </Table.Body>
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
