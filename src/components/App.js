import React, { Component } from 'react';

import Gallery from './Gallery';
import { fetchPhotosData } from '../utils/api';

class App extends Component {
  state = {
    page: 1,
    photos: [],
    isFetchingPhotos: true,
  };

  componentDidMount() {
    this.fetchPhotos();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      this.fetchPhotos();
    }
  }

  async fetchPhotos() {
    const newPhotos = await fetchPhotosData(this.state.page);

    this.setState(prevState => ({
      photos: prevState.photos.concat(newPhotos),
      isFetchingPhotos: false,
    }));
  }

  nextPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      isFetchingPhotos: true,
    }));
  };

  render() {
    const { photos, isFetchingPhotos, page } = this.state;

    return (
      <div>
        <Gallery
          batch={page}
          photos={photos}
          fetchNextPhotos={this.nextPage}
          isFetchingPhotos={isFetchingPhotos}
        />
      </div>
    );
  }
}

export default App;
