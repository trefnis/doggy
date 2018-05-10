import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/fp/debounce';

import PhotoTile from './PhotoTile';
import { getCurrentBreakpoint } from '../utils/rwd';

const GalleryContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
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

    this.setState({ width, currentBreakpoint });
  });

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
            <PhotoTile
              key={photo.id}
              photo={photo}
              currentBreakpoint={currentBreakpoint}
              containerWidth={width}
            />
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
