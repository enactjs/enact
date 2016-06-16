import R from 'ramda';

export const getBounds = R.compose(
  R.zipObj(['left', 'top', 'width', 'height']),
  R.props(['offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight'])
);
