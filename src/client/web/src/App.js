import React from 'react';
import './App.css';

import {
  HashRouter as Router,
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

import { Search } from './Search';
import { SearchResults } from './SearchResults';
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
      <Router>
        <div className="App">
          {/*<div className="App-header">
            <h1>Holdings Analysis</h1>
          </div>*/}

          <div className="App-body">
            { !this.state.stitchInitialized && !this.state.loading? <><div style={{ minHeight: '30vh' }}></div>Error connecting to MongoDB Stitch!</> :null }
            { !this.state.stitchInitialized && this.state.loading? <><div style={{ minHeight: '30vh' }}></div>Connecting to MongoDB Stitch server ...</>:<>
            <Switch>
              <Route
                path='/'
                exact
                render={
                  (props) => <div className="Welcome">
                    <h2>Welcome to the Holdings Analysis tool!</h2>
                    <strong>Search tips:</strong>
                    <ol>
                      <li>Search tokens match by a logical <strong>OR</strong>.  Ex: <strong>tech media consulting firm</strong> yields results matching any of those words.</li>
                      <li>To search by exact phrase, use double quotes ({ '"' }).  Ex: <strong>{ '"apple computer"' }</strong> yields results matching <strong>apple computer</strong> EXACTLY.</li>
                      <li>To exclude a term, prepend that term with a hyphen ({ '-' }).  Ex: <strong>apple -computer</strong> yields results matching <strong>apple</strong> but NOT <strong>computer</strong>.</li>
                    </ol>
                    
                  </div>
                }
              />
            </Switch>
            <Search />
            <Switch>
              <Route
                path='/search/:search?'
                render={
                  (props) =>  <SearchResults {...props}
                                stitch={ this.stitch }
                                stitchInitialized={ this.state.stitchInitialized }
                              />
                }
              />
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
