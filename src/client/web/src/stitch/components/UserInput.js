import React from 'react';

import { StitchController } from '../';

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
        this.stitch.callFunction('getAverageTimePositionsHeldForFund', [cleanInput, options])
        .then(results1 => {
          return this.stitch.callFunction('getPositionsForFund', [cleanInput, options])
          .then(results2 => {
            return {
              'getAverageTimePositionsHeldForFund': results1,
              'getPositionsForFund': results2
            };
          })
          .catch(err => {
            console.log(err);
            return {};
          });
        })
        .then(this.props.handleSubmission)
        .catch(err => {
          console.log(err);
        });
        break;

      case 'ticker':
        this.stitch.callFunction('getHoldersForTicker', [cleanInput, options])
        .then(results => {
          return {
            'getHoldersForTicker': results
          };
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.props.handleSubmission)
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
        <Button.Group>
          <Button
            loading={ this.state.loading }
            disabled={ this.state.loading }
            onClick={ () => this._handleClick('fund') }
          >
            Fund
          </Button>
          <Button
            loading={ this.state.loading }
            disabled={ this.state.loading }
            onClick={ () => this._handleClick('ticker') }
          >
            Ticker
          </Button>
        </Button.Group>
        <p><code>(Hint:  Try Fund:'1511144' or Ticker:'00206R102'.)</code></p>
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
