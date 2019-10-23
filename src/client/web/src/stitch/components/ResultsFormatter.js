import React from 'react';

export class ResultsFormatter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      results: null
    };
  }

  render() {
    return (<>
      { this.props.stitchFunctionResults }
    </>);
  }
};
