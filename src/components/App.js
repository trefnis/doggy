import React, { Component } from 'react';

import Gallery from './Gallery';
import ErrorMessage from './ErrorMessage';
import { fetchPhotosData } from '../utils/api';

class App extends Component {
  state = {
    page: 1,
    photos: [],
    isFetchingPhotos: true,
    hasError: false,
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
    let newPhotos;
    try {
      newPhotos = await fetchPhotosData(this.state.page);
    } catch (error) {
      // Would be logging in real app
      console.error(error);

      this.setState({ hasError: true });
      return;
    }

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

  hideError = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { photos, isFetchingPhotos, page, hasError } = this.state;

    return (
      <div>
        <Gallery
          batch={page}
          photos={photos}
          fetchNextPhotos={this.nextPage}
          isFetchingPhotos={isFetchingPhotos}
        />
        <ErrorMessage isShown={hasError} close={this.hideError} />
      </div>
    );
  }
}

export default App;
