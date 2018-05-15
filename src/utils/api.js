import axios from 'axios';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import get from 'lodash/fp/get';

export const photoSizeSymbols = ['k', 'h', 'l', 'c', 'z', 'm', 'n'];

const flickrClient = axios.create({
  baseURL: 'https://api.flickr.com/services/rest',
  params: {
    api_key: process.env.REACT_APP_FLICKR_API_KEY,
    format: 'json',
    nojsoncallback: 1,
  },
});

const baseSearchParams = {
  method: 'flickr.photos.search',
  text: 'dog',
  sort: 'interestingness-desc',
  per_page: 20,
  extras: [
    'date_upload',
    'description',
    'owner_name',
    'media',
    'icon_server',
    ...photoSizeSymbols.map(size => `url_${size}`),
  ].join(','),
};

function preparePhotoData(data, page) {
  return data.photos.photo.map(props => {
    const presentSizeSymbols = filter(
      size => get(`url_${size}`, props),
      photoSizeSymbols
    );

    const sizes = map(size => {
      const width = parseInt(props[`width_${size}`], 10);
      const height = parseInt(props[`height_${size}`], 10);
      const url = props[`url_${size}`];

      return { size, url, width, height };
    }, presentSizeSymbols);

    return { ...props, sizes, batch: page };
  });
}

export async function fetchPhotosData(page = 1) {
  const { data } = await flickrClient.get('/', {
    params: {
      ...baseSearchParams,
      page,
    },
  });

  if (data.stat === 'ok') {
    return preparePhotoData(data, page);
  } else {
    const error = new Error(data.message);
    error.code = data.code;
    throw error;
  }
}
