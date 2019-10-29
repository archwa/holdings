import React from 'react';

// main components for user interface
import { UserInput } from './UserInput';
import { ResultsFormatter } from './ResultsFormatter';

export class UserInterface extends React.Component {
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      submissionResults: null  // to store submission results for display in child component(s)
    };
    
    // bind non-React functions
    this._handleSubmission = this._handleSubmission.bind(this);
  }

  // handle the submission of the child UserInput component
  _handleSubmission(results) {
    this.setState({ submissionResults: results });
  }

  componentDidMount() {
    
  }
  
  render() {
    return (<div>
      <UserInput
        handleSubmission={ this._handleSubmission } // pass down submission handler to store results
      />
      <br/>
      <ResultsFormatter
        results={ this.state.submissionResults? this.state.submissionResults :undefined }
      />
    </div>);
  }
};
