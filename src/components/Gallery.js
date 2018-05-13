import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Masonry from 'masonry-layout';
import debounce from 'lodash/fp/debounce';

import PhotoTile from './PhotoTile';
import { getCurrentBreakpoint } from '../utils/rwd';

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
    columnWidth: 512,
    fitWidth: true,
  },
  desktop: {
    columnWidth: 512,
    fitWidth: true,
  },
};

const GalleryContainer = styled.div`
  margin: 0 auto;
`;

class Gallery extends Component {
  state = {
    currentBreakpoint: null,
    width: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.update);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.update);
  }

  update = debounce(200, () => {
    const width = this.container.offsetWidth;
    const currentBreakpoint = getCurrentBreakpoint();

    this.setState({ width, currentBreakpoint }, () => {
      const shouldRecreateMasonry =
        !this.masonry ||
        this.masonry.option.columnWidth !==
          masonryOptions[getCurrentBreakpoint()].columnWidth;

      if (shouldRecreateMasonry) {
        this.layout();
      }
    });
  });

  layout = () => {
    if (this.masonry) {
      this.masonry.destroy();
    }

    const options = {
      ...masonryOptions[this.state.currentBreakpoint],
      itemSelector: '.photo',
    };

    this.masonry = new Masonry(this.container, options);
  };

  refHandler = container => {
    this.container = container;
    this.update();
  };

  render() {
    const { currentBreakpoint, width } = this.state;

    // TODO: loader
    return (
      <GalleryContainer innerRef={this.refHandler}>
        {currentBreakpoint &&
          width &&
          this.props.photos.map(photo => (
            <div className="photo" key={photo.id}>
              <PhotoTile
                key={photo.id}
                photo={photo}
                currentBreakpoint={currentBreakpoint}
                containerWidth={width}
              />
            </div>
          ))}
      </GalleryContainer>
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
