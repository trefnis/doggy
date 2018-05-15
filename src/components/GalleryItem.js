import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import { media } from '../utils/rwd';
import { getCorrectImageProps } from '../utils/tileSizing';

export const cardWidth = 500;
export const cardMargin = 6;

const PhotoTileContainer = styled.div`
  margin: ${cardMargin}px;
`;

const PhotoTile = styled(Card)`
  width: ${props => props.width - cardMargin * 2}px;

  ${media.laptop`
    width: ${cardWidth}px;
  `};
`;

const PhotoThumbnail = ({
  containerWidth,
  currentBreakpoint,
  imagesWithSizes,
  ...props
}) => (
  <CardMedia
    component="img"
    {...getCorrectImageProps({
      containerWidth,
      cardWidth,
      currentBreakpoint,
      imagesWithSizes,
    })}
    {...props}
  />
);

const getDate = timestamp => new Date(timestamp * 1000).toLocaleString();

const getAvatarlUrl = ({ owner: userId, farm, iconserver }) =>
  `http://farm${farm}.staticflickr.com/${iconserver}/buddyicons/${userId}.jpg`;

/* No description prop is used due to either risk with XSS/CSRF as flickr allows HTML content or showing ugly escaped html. Correct handling this case would require more effort as security is not trivial and can't be sacrificed. */
class GalleryItem extends Component {
  state = {
    isVisible: true,
  };

  containerRef = React.createRef();

  componentDidMount() {
    const observerOptions = {
      root: null,
      rootMargin: `2000px`,
      threshold: 0,
    };

    this.observer = new window.IntersectionObserver(
      this.handleIntersection,
      observerOptions
    );

    this.observer.observe(this.containerRef.current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  handleIntersection = ([entry]) => {
    this.setState({
      isVisible: entry.intersectionRatio !== 0,
    });
  };

  render() {
    const { photo, currentBreakpoint, containerWidth } = this.props;

    return (
      <div ref={this.containerRef}>
        {this.state.isVisible && (
          <PhotoTileContainer>
            <PhotoTile width={containerWidth}>
              <CardHeader
                avatar={
                  <Avatar src={getAvatarlUrl(photo)} alt={photo.ownername} />
                }
                title={photo.ownername}
                subheader={getDate(photo.dateupload)}
              />
              <PhotoThumbnail
                imagesWithSizes={photo.sizes}
                currentBreakpoint={currentBreakpoint}
                containerWidth={containerWidth}
                alt={photo.title}
              />
              <CardContent>
                <Typography component="p">{photo.title}</Typography>
              </CardContent>
            </PhotoTile>
          </PhotoTileContainer>
        )}
      </div>
    );
  }
}

GalleryItem.propTypes = {
  photo: PropTypes.object.isRequired,
  currentBreakpoint: PropTypes.string.isRequired,
  containerWidth: PropTypes.number.isRequired,
};

export default GalleryItem;
