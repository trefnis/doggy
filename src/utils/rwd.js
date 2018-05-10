import { css } from 'styled-components';
import memoize from 'lodash/fp/memoize';
import debounce from 'lodash/fp/debounce';

export const sizes = {
  desktop: 1440,
  laptop: 1024,
  tablet: 768,
};

const mediaForSize = label => `(min-width: ${sizes[label]}px)`;

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media ${mediaForSize(label)} {
      ${css(...args)};
    }
  `;

  return acc;
}, {});

export const getCurrentBreakpoint = memoize(() => {
  window.addEventListener(
    'resize',
    debounce(100, () => {
      getCurrentBreakpoint.cache.clear();
    })
  );

  return (
    (window.matchMedia(mediaForSize('desktop')).matches && 'desktop') ||
    (window.matchMedia(mediaForSize('laptop')).matches && 'laptop') ||
    (window.matchMedia(mediaForSize('tablet')).matches && 'tablet') ||
    'mobile'
  );
});

window.getCurrentBreakpoint = getCurrentBreakpoint;
