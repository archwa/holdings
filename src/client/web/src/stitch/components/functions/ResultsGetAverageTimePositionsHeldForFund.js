import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

export class ResultsGetAverageTimePositionsHeldForFund extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.results.data,
      rawData: this.props.results.data,
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

  render() {
    const { data } = this.state;

    return (
      <div style={ styles.container }>
        <Table celled>
          <Table.Body>
            <Table.Row key='total'>
              <Table.Cell>
                <strong>Total Positions Found</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ data.positionsCount }</code>
              </Table.Cell>
            </Table.Row>
            <Table.Row key='year'>
              <Table.Cell>
                <strong>Average Time Held of All Positions (Years)</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ Math.round(data.averageLengthOfStockOwnership.years * 1000) / 1000 }</code>
              </Table.Cell>
            </Table.Row>
            <Table.Row key='quarters'>
              <Table.Cell>
                <strong>Average Time Held of All Positions (Quarters)</strong>
              </Table.Cell>
              <Table.Cell>
                <code>{ Math.round(data.averageLengthOfStockOwnership.quarters * 1000) / 1000 }</code>
              </Table.Cell>
            </Table.Row>
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
