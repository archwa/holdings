import React from 'react';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';

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
        <Table>
          <TableBody>
            <TableRow key='total'>
              <TableCell>
                <strong>Total Positions Found</strong>
              </TableCell>
              <TableCell>
                <code>{ data.positionsCount }</code>
              </TableCell>
            </TableRow>
            <TableRow key='year'>
              <TableCell>
                <strong>Average Time Held of All Positions (Years)</strong>
              </TableCell>
              <TableCell>
                <code>{ Math.round(data.averageLengthOfStockOwnership.years * 1000) / 1000 }</code>
              </TableCell>
            </TableRow>
            <TableRow key='quarters'>
              <TableCell>
                <strong>Average Time Held of All Positions (Quarters)</strong>
              </TableCell>
              <TableCell>
                <code>{ Math.round(data.averageLengthOfStockOwnership.quarters * 1000) / 1000 }</code>
              </TableCell>
            </TableRow>
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
