import React from 'react';
import './App.css';
import { blue } from '@material-ui/core/colors';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
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
import HomeIcon from '@material-ui/icons/Home';

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
            <Link to='/' style={{ zIndex: 10, width: 32, height: 32, position: 'absolute', top: 5, left: 5 }}><HomeIcon
              style={{ width: 32, height: 32, color: blue[500]}}
            /></Link>
            <Switch>
              <Route
                path='/'
                exact
                render={
                  (props) => <div className="Welcome">
                    <h2>Welcome to the Holdings Analysis tool!</h2>
                    The purpose of this tool is to enable research of both current &amp; historical holders of issued financial securities (holdings).<br/>
                    This tool uses publicly available data disseminated by the U.S. Securities and Exchange Commission (SEC), the NASDAQ stock exchange, and others.<br/>
                    To start using the tool, enter a search query using the search bar below.<br/>
                    <span>You may search either by company (e.g. <strong>Tesla</strong> for Tesla Inc.) or by stock symbol (e.g. <strong>MSFT</strong> for Microsoft Corp.)  (... or <em>both</em> via search query string in the address bar.)</span>

                    <h3>Definitions</h3>
                    <ul>
                      <li><strong>Holders</strong> are people, companies, and other entities that own, or <em>hold</em>, a financial security.</li>
                      <li><strong>Holdings</strong> are collections of financial securities issued to a given holder.</li>
                      <li><strong>Issuers</strong> are companies that issue, or ascribe ownership of, financial securities to holders.</li>
                      <li><strong>Filers</strong> are people, companies, and other entities that have filed any form with the SEC.</li>
                    </ul>
                    
                    <h3>Search Tips</h3>
                    <ul>
                      <li>By default, search tokens match by a logical <em>or</em> operation.  <strong>Example:</strong> The search query <strong>apple computer</strong> yields results matching <strong>apple</strong>, <strong>computer</strong>, or <em>both</em>.</li>
                      <li>To search by exact phrase, use double quotes ({ '"' }).  <strong>Example:</strong> The search query <strong>{ '"apple computer"' }</strong> yields results matching <strong>apple computer</strong> EXACTLY.</li>
                      <li>To exclude a term, prepend that term with a hyphen ({ '-' }).  <strong>Example:</strong> The search query <strong>apple -computer</strong> yields results matching <strong>apple</strong> but NOT <strong>computer</strong>.</li>
                    </ul>

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
