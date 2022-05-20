import React from 'react';

import { Carousel } from '../../ui';

export const Pane = ({
  sourceQuery
}) => {
  const [sourceType, sourceDetails] = sourceQuery.split(':', 2);
  if (sourceType === 'category') {
    const sources = sourceDetails?.split(',')?.map(val => `https://digitalsignage.manninghamuc.org/category/${val}/feed/`);

    return sources ? (
      <Carousel
        categories={sources}
      />
    ) : null;
  }

  if (sourceType === 'events') {
    return 'Google calendar';
  }

  return null;
}