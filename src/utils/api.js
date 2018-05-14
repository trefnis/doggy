import axios from 'axios';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import get from 'lodash/fp/get';

const flickrClient = axios.create({
  baseURL: 'https://api.flickr.com/services/rest',
  params: {
    api_key: process.env.REACT_APP_FLICKR_API_KEY,
    format: 'json',
    nojsoncallback: 1,
  },
});

export const photoSizeSymbols = ['k', 'h', 'l', 'c', 'z', 'm', 'n'];

export async function fetchPhotosData(page = 1) {
  const { data } = await flickrClient.get('/', {
    params: {
      method: 'flickr.photos.search',
      tags: 'dog',
      page,
      per_page: 10,
      extras: [
        'date_upload',
        'description',
        'owner_name',
        'media',
        'icon_server',
        ...photoSizeSymbols.map(size => `url_${size}`),
      ].join(','),
    },
  });

  if (data.stat === 'ok') {
    const photo = data.photos.photo.map(props => {
      const presentSizeSymbols = filter(
        size => get(`url_${size}`, props),
        photoSizeSymbols
      );

      const sizes = map(size => {
        const width = parseInt(props[`width_${size}`]);
        const height = parseInt(props[`height_${size}`]);
        const url = props[`url_${size}`];

        return { size, url, width, height };
      }, presentSizeSymbols);

      return { ...props, sizes, batch: page };
    });

    return photo;
  }
}
