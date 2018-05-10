import React, { Component } from 'react';

import Gallery from './Gallery';
import { fetchPhotosData } from '../utils/api';

class App extends Component {
  state = {
    photosData: [],
  };

  componentDidMount() {
    this.fetchPhotosData();
  }

  async fetchPhotosData() {
    const photosData = await fetchPhotosData({ page: 1 });

    this.setState({
      photosData,
    });
  }

  render() {
    return (
      <div>
        <Gallery photos={this.state.photosData} />
      </div>
    );
  }
}

export default App;
