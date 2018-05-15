import React, { Component } from 'react';

import App from './App';
import ErrorMessage from './ErrorMessage';

class AppContainer extends Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });

    // Would be logging in real app.
    console.error(error, info);
  }

  render() {
    return this.state.hasError ? <ErrorMessage isShown /> : <App />;
  }
}

export default AppContainer;
