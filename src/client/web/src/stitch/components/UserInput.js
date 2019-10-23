import React from 'react';

import { StitchController } from '../';
import { Button, Input } from 'semantic-ui-react';

export class UserInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,  // is the UI still loading?
      status: 0,      // zero means OK, non-zero means NOT OK
    };

    // instantiate Stitch controller
    this.stitch = new StitchController();
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
        />
        <Button.Group>
          <Button
            loading={ this.state.loading }
            disabled={ this.state.loading }
            onClick={ () => alert("fund") }
          >
            Fund
          </Button>
          <Button
            loading={ this.state.loading }
            disabled={ this.state.loading }
            onClick={ () => alert("ticker") }
          >
            Ticker
          </Button>
        </Button.Group>
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
