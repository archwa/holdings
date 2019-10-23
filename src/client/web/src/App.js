import React from 'react';
import './App.css';

// need this to format all semantic ui components
import 'semantic-ui-css/semantic.min.css';

// need this for the Stitch UI
import { StitchComponents } from './stitch';

import Logo from './media/assets/images/gghc.png';

class App extends React.Component {
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      window: {
        width: 0,
        height: 0
      }
    };

    // bind non-React functions
    this._updateWindowDimensions = this._updateWindowDimensions.bind(this);
  }

  _updateWindowDimensions() {
    this.setState({ window: { width: window.innerWidth, height: window.innerHeight } });
  }

  componentDidMount() {
    this._updateWindowDimensions();
    window.addEventListener('resize', this._updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._updateWindowDimensions);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={Logo} id="logo" alt="GGHC logo" width={ 938/2 < this.state.window.width * 0.8? 938/2 :Math.round(this.state.window.width * 0.8) }/>
          <h1>Holdings Analysis</h1>
        </div>
        <div className="App-body">
          <StitchComponents.UserInterface/>
        </div>
      </div>
    );
  }
}

export default App;
