import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'masonry-layout';

import PhotoTile, { cardWidth, cardMargin } from './PhotoTile';
import InfiniteScroll from './InfiniteScroll';
import { getCurrentBreakpoint } from '../utils/rwd';

const photoTileFixedWidth = cardWidth + cardMargin * 2;

const masonryOptions = {
  mobile: {
    percentPosition: true,
    columnWidth: '.photo',
  },
  tablet: {
    percentPosition: true,
    columnWidth: '.photo',
  },
  laptop: {
    columnWidth: photoTileFixedWidth,
    fitWidth: true,
  },
  desktop: {
    columnWidth: photoTileFixedWidth,
    fitWidth: true,
  },
};

class Gallery extends Component {
  state = {
    currentBreakpoint: null,
    width: null,
    isLayingOutPhotos: true,
  };

  componentDidMount() {
    const width = this.container.offsetWidth;
    const currentBreakpoint = getCurrentBreakpoint();

    this.setState({ width, currentBreakpoint });
  }

  componentWillUnmount() {
    if (this.masonry) {
      this.masonry.destroy();
    }
  }

  componentDidUpdate(prevProps) {
    const { photos: previousPhotos } = prevProps;
    const { photos: currentPhotos, batch } = this.props;

    if (previousPhotos === currentPhotos) {
      return;
    }

    if (previousPhotos.length === 0) {
      this.layout();
    } else {
      this.layoutNewPhotos(batch);
    }
  }

  layoutNewPhotos(batch) {
    const newImages = this.container.querySelectorAll(`.photo-batch-${batch}`);

    this.masonry.once('layoutComplete', () => {
      this.setState({ isLayingOutPhotos: false });
    });

    this.masonry.appended(newImages);
  }

  layout = () => {
    const options = {
      ...masonryOptions[this.state.currentBreakpoint],
      itemSelector: '.photo',
    };

    this.masonry = new Masonry(this.container, options);

    this.masonry.once('layoutComplete', () => {
      this.setState({ isLayingOutPhotos: false });
    });

    this.masonry.layout();
  };

  // Don't use createRef to force being called before componentDidMount
  refHandler = container => {
    this.container = container;
  };

  render() {
    const { currentBreakpoint, width, isLayingOutPhotos } = this.state;
    const { photos, isFetchingPhotos, fetchNextPhotos } = this.props;

    return (
      <InfiniteScroll
        isLoading={isFetchingPhotos || isLayingOutPhotos}
        fetch={fetchNextPhotos}
      >
        <div ref={this.refHandler} style={{ margin: '0 auto' }}>
          {currentBreakpoint &&
            width &&
            photos.map(photo => (
              <div
                className={`photo photo-batch-${photo.batch}`}
                key={photo.id}
              >
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  currentBreakpoint={currentBreakpoint}
                  containerWidth={width}
                />
              </div>
            ))}
        </div>
      </InfiniteScroll>
    );
  }
}

Gallery.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object),
};

Gallery.defaultProps = {
  photos: [],
};

export default Gallery;
