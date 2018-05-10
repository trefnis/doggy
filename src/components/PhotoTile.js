import React from 'react';
import styled from 'styled-components';
import Card, { CardHeader, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';

import { media } from '../utils/rwd';
import { getCorrectImageProps } from '../utils/tileSizing';

const cardWidth = 500;
const cardMargin = 6;

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
const Gallery = ({ photo, currentBreakpoint, containerWidth }) => (
  <PhotoTileContainer>
    <PhotoTile width={containerWidth}>
      <CardHeader
        avatar={<Avatar src={getAvatarlUrl(photo)} alt={photo.ownername} />}
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
);

export default Gallery;
