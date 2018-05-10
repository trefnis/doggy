import reverse from 'lodash/fp/reverse';

const getImageWithSufficientWidth = (minWidth, imagesWithSizes) => {
  for (let image of reverse(imagesWithSizes)) {
    if (image.width >= minWidth) {
      return image;
    }
  }

  return imagesWithSizes[0];
};

const calculateHeight = (image, desiredWidth) => {
  const modifier = desiredWidth / image.width;
  return modifier * image.height;
};

export const getCorrectImageProps = ({
  containerWidth,
  cardWidth,
  currentBreakpoint,
  imagesWithSizes,
}) => {
  const shouldFillContainer =
    currentBreakpoint === 'mobile' || currentBreakpoint === 'tablet';

  const width = shouldFillContainer ? containerWidth : cardWidth;

  const sufficientWidthImage = getImageWithSufficientWidth(
    width,
    imagesWithSizes
  );

  const height = calculateHeight(sufficientWidthImage, width);

  return { width, height, src: sufficientWidthImage.url };
};
