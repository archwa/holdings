import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

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
    const columnNames = [ 'cik', 'from', 'to', 'quarters' ];
    const columnNameDisplay = {
      'cik': 'CIK',
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
              _.map(data, ({ cik, from, to, quarters }, idx) => (
                  <Table.Row key={ _.join([cik, '-', idx], '') }>
                    <Table.Cell><code>{ cik }</code></Table.Cell>
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
