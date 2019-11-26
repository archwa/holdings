import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
//  Link
} from "react-router-dom";

/*
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
*/

// need this for the Stitch UI
//import { StitchComponents } from './stitch';

import { HoldingsView } from './HoldingsView';
import { HoldersView } from './HoldersView';
import { StitchController } from './stitch';

//import Logo from './media/assets/images/gghc.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      window: {
        width: 0,
        height: 0
      },
      'stitchInitialized': false,
      'loading': true
    };

    // intantiate Stitch controller
    this.stitch = new StitchController();

    // bind non-React functions
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  _updateWindowDimensions() {
    this.setState({ window: { width: window.innerWidth, height: window.innerHeight } });
  }

  componentDidMount() {
    this._updateWindowDimensions();
    window.addEventListener('resize', this._updateWindowDimensions);

    console.log('Initializing Stitch ...');
    this.stitch.init()
    .then(err => {
      if(!err) {
        console.log('Stitch initialization complete!');
        this.setState({
          'stitchInitialized': true,
          'loading': false,
        });
      }
      else {
        console.error('Stitch initialization error:', err);
        this.setState({
          'stitchInitialized': false,
          'loading': false,
        });
      }
    })
    .catch(err => {
      console.error('Stitch initialization error:', err);
      this.setState({
        'stitchInitialized': false,
        'loading': false
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateWindowDimensions);
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL} >
        <div className="App">
          {/*<div className="App-header">
            <h1>Holdings Analysis</h1>
          </div>*/}

          <div className="App-body">
            { !this.state.stitchInitialized && !this.state.loading? "Error connecting to MongoDB Stitch!" :null }
            { !this.state.stitchInitialized && this.state.loading? <><div style={{ minHeight: '30vh' }}></div>Connecting to MongoDB Stitch server ...</>:<>
            { /*
            <Paper>
              <TextField id="searchQuery" label="Search" variant="outlined" />
              <ButtonGroup variant="text" aria-label="regular contained button group">
                <Button>Company</Button>
                <Button>Symbol</Button>
              </ButtonGroup>
            </Paper>
            */ }
            <Switch>
              <Route
                path='/holdings/:cik?'
                render={
                  (props) =>  <HoldingsView {...props}
                                stitch={ this.stitch }
                                stitchInitialized={ this.state.stitchInitialized }
                              />
                }
              />
              <Route
                path='/holders/:cusip?'
                render={
                  (props) =>  <HoldersView {...props}
                                stitch={ this.stitch }
                                stitchInitialized={ this.state.stitchInitialized }
                              />
                }
              />
            </Switch>
            </>}
          </div>

        </div>
      </Router>
    );
  }
}

export default App;
