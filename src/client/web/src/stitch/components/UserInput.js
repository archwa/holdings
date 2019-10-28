import React from 'react';
import _ from 'lodash';

import { StitchController } from '../';
import { Input, Button, ButtonGroup } from '@material-ui/core';

export class UserInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,  // is the UI still loading?
      status: 0,      // zero means OK, non-zero means NOT OK
      inputValue: ""
    };

    // instantiate Stitch controller
    this.stitch = new StitchController();
    
    // bind this for non-React functions
    this._handleInputChange = this._handleInputChange.bind(this);
  }

  _handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  _handleClick(name) {
    // clean up the input here if you want
    const cleanInput = this.state.inputValue;

    // TODO : add support for the checkbox (choosing the current holders / positions only)
    const options = {
      currentOnly: false
    };

    switch(name) {
      case 'fund':
        this.stitch.callFunction('searchForFund', [cleanInput])
        .then(searchResult => {
          console.log(searchResult);
          // TODO : check status of result
          const cik = _.get(searchResult, 'data.cik', null);

          return this.stitch.callFunction('getAverageTimePositionsHeldForFund', [cik, options])
          .then(avgPosResult => {
            return this.stitch.callFunction('getPositionsForFund', [cik, options])
            .then(posForFundResult => {

              return {
                'searchForFund': searchResult,
                'getAverageTimePositionsHeldForFund': avgPosResult,
                'getPositionsForFund': posForFundResult,
              };
            })
            .catch(err => {
              console.log(err);
              return {};
            });
          })
        })
        .then(res => {
          console.log(res);
          return this.props.handleSubmission(res);
        })
        .catch(err => {
          console.log(err);
        });
        break;

      case 'ticker':
        this.stitch.callFunction('searchForCompany', [cleanInput])
        .then(searchResult => {
          console.log(searchResult);
          // TODO : check status of result
          const cusip = _.get(searchResult, 'data.cusip', null);
          
          return this.stitch.callFunction('getHoldersForTicker', [cusip, options])
          .then(results => {
            return {
              'searchForCompany': searchResult,
              'getHoldersForTicker': results
            };
          })
          .catch(err => {
            console.log(err);
          })
        })
        .then(res => {
          console.log(res);
          return this.props.handleSubmission(res);
        })
        .catch(err => {
          console.log(err);
        });
        break;

      default:
    }
  }

  componentDidMount() {
    // initialize Stitch controller
    this.stitch.init()
    .then(() => {
      this.setState({ loading: false, status: 0 });  // no longer loading
    })
    .catch(err => {
      console.log(err);
      this.setState({ loading: false, status: -1 });  // no longer loading, but bad status
    });
  }

  render() {
    return (
      <div style={ styles.container }>
        <Input
          disabled={ this.state.loading }
          error={ this.state.error }
          placeholder="Search ..."
          style={ styles.input }
          value={ this.state.inputValue }
          onChange={ this._handleInputChange }
        />
        <ButtonGroup>
          <Button
            disabled={ this.state.loading }
            onClick={ () => this._handleClick('fund') }
          >
            Fund
          </Button>
          <Button
            disabled={ this.state.loading }
            onClick={ () => this._handleClick('ticker') }
          >
            Ticker
          </Button>
        </ButtonGroup>
      </div>
    );
  }
};

const styles = {
  container: {
    
  },
  button: {

  },
  input: {
    margin: 5,
  }
};
