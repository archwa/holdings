import React from 'react';
import _ from 'lodash';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';

export class ResultsFormatter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: this.props.results,
      column: null,
      direction: null,
    };
  }

  handleSort = (clickedColumn, type) => () => {
    if(type === 'fund') {
      const { column, direction } = this.state;
      const fundData = this.state.fundData? this.state.fundData :_.get(this, 'props.results.getPositionsForFund.data', null);

      if (column !== clickedColumn) {
        this.setState({
          column: clickedColumn,
          fundData: _.sortBy(fundData, [clickedColumn]),
          direction: 'ascending',
        });

        return;
      }

      this.setState({
        fundData: fundData.reverse(),
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
    else {
      const { column, direction } = this.state;
      const tickerData = this.state.tickerData? this.state.tickerData :_.get(this, 'props.results.getHoldersForTicker.data', null);

      if (column !== clickedColumn) {
        this.setState({
          column: clickedColumn,
          tickerData: _.sortBy(tickerData, [clickedColumn]),
          direction: 'ascending',
        });

        return;
      }

      this.setState({
        tickerData: tickerData.reverse(),
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  }

  render() {
    const { column, direction } = this.state;

    const fundData = this.state.fundData? this.state.fundData :_.get(this, 'props.results.getPositionsForFund.data', null);
    const tickerData = this.state.tickerData? this.state.tickerData :_.get(this, 'props.results.getHoldersForTicker.data', null);
    const avgPos = _.get(this, 'props.results.getAverageTimePositionsHeldForFund.data', null);

    return (
      <div style={ styles.container }>
        { avgPos?
        <Table celled>
          <Table.Body>
            <Table.Row key='total'>
              <Table.Cell>
                <strong>Total Positions Found</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ avgPos.positionsCount }</code>
              </Table.Cell>
            </Table.Row>
            <Table.Row key='year'>
              <Table.Cell>
                <strong>Average Time Held of All Positions (Years)</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ Math.round(avgPos.averageLengthOfStockOwnership.years * 1000) / 1000 }</code>
              </Table.Cell>
            </Table.Row>
            <Table.Row key='quarters'>
              <Table.Cell>
                <strong>Average Time Held of All Positions (Quarters)</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ Math.round(avgPos.averageLengthOfStockOwnership.quarters * 1000) / 1000 }</code>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table> :"" }
            
        { fundData?
        <Table sortable celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'cusip' ? direction : null}
                onClick={this.handleSort('cusip', 'fund')}
              >
                CUSIP
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'from' ? direction : null}
                onClick={this.handleSort('from', 'fund')}
              >
                From
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'to' ? direction : null}
                onClick={this.handleSort('to', 'fund')}
              >
                To
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'quarters' ? direction : null}
                onClick={this.handleSort('quarters', 'fund')}
              >
                Quarters
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(fundData, ({ cusip, from, to, quarters }, idx) => (
              <Table.Row key={cusip+'-'+idx}>
                <Table.Cell><code>{cusip}</code></Table.Cell>
                <Table.Cell><code>{from}</code></Table.Cell>
                <Table.Cell><code>{to}</code></Table.Cell>
                <Table.Cell><code>{quarters}</code></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table> :""}

        { tickerData?
        <Table sortable celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'cik' ? direction : null}
                onClick={this.handleSort('cik', 'ticker')}
              >
                CIK
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'from' ? direction : null}
                onClick={this.handleSort('from', 'ticker')}
              >
                From
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'to' ? direction : null}
                onClick={this.handleSort('to', 'ticker')}
              >
                To
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'quarters' ? direction : null}
                onClick={this.handleSort('quarters', 'ticker')}
              >
                Quarters
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(tickerData, ({ cik, from, to, quarters }, idx) => (
              <Table.Row key={cik+'-'+idx}>
                <Table.Cell><code>{cik}</code></Table.Cell>
                <Table.Cell><code>{from}</code></Table.Cell>
                <Table.Cell><code>{to}</code></Table.Cell>
                <Table.Cell><code>{quarters}</code></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table> :""}
      </div>
    );
  }
};

const styles = {
  container: {
    margin: 20
  }
};
