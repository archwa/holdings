import React from 'react';

import {
  Redirect
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import queryString from 'query-string';

const ColorButton = withStyles(theme => ({
  root: {
    color: 'white',
    backgroundColor: blue[500],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button);

const styles = {
  'container': {
    position: 'relative',
    margin: '10px',
    textAlign: 'center',
    justifyContent: 'center',
  },
  'textField': {
    margin: '5px',
    width: '50%',
    minWidth: '300px',
    display: 'inline-block',
  },
  'buttonGroup': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-block',
  },
  'button': {
    height: '100%',
  }
};

export class Search extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      'redirect': {
        go: false,
        location: '/',
      },
      value: ''
    };

    this._handleCompanySearch = this._handleCompanySearch.bind(this);
    this._handleSymbolSearch = this._handleSymbolSearch.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(event) {
    this.setState({
      'value': event.target.value
    });  
  }

  _handleCompanySearch(q) {
    const parsedQuery = {
      'company': this.state.value
    };

    const qs = queryString.stringify(parsedQuery);

    let newRedirect = { ...this.state.redirect };
    newRedirect.location = ('/search?' + qs);
    newRedirect.go = true;

    this.setState({ redirect: newRedirect });  
  }


  _handleSymbolSearch(q) {
    const parsedQuery = {
      'symbol': this.state.value
    };

    const qs = queryString.stringify(parsedQuery);

    let newRedirect = { ...this.state.redirect };
    newRedirect.location = ('/search?' + qs);
    newRedirect.go = true;

    this.setState({ redirect: newRedirect });  
  }

  render() {
    const redirect = this.state.redirect.go;
    const location = this.state.redirect.location;

    return (<div style={ styles.container }>
      <form onSubmit={ this._handleCompanySearch }>
      { redirect? <Redirect to={ location } /> :null }
      <TextField
        onChange={this._handleChange}
        label='Search'
        variant='outlined'
        style={ styles.textField }
        fullWidth
      />
      <ButtonGroup style={ styles.buttonGroup }>
        <ColorButton variant='contained' onClick={ this._handleCompanySearch } style={ styles.button }>
          Company
        </ColorButton>
        <ColorButton variant='contained' onClick={ this._handleSymbolSearch } style={ styles.button }>
          Symbol
        </ColorButton>
      </ButtonGroup>
      </form>
    </div>);
  }

};

