import React from 'react';

import { Carousel, Events } from '../../ui';

export const Pane = ({
  sourceQuery
}) => {
  const [sourceType, ...sourceDetailsArray] = sourceQuery.split(':');
  const sourceDetails = sourceDetailsArray.join(':');
  console.log({ sourceType, sourceDetailsArray, sourceDetails });
  if (sourceType === 'category') {
    const sources = sourceDetails?.split(',')?.map(val => `https://digitalsignage.manninghamuc.org/category/${val}/feed/`);

    return sources ? (
      <Carousel
        categories={sources}
      />
    ) : null;
  }

  if (sourceType === 'events') {
    const [calendarId, apiKey, dayOffset = '0'] = sourceDetails?.split(':') || [];
    console.log({ sourceDetails, calendarId, apiKey });

    return (
      <Events
        calendarId={calendarId}
        apiKey={apiKey}
        dayOffset={dayOffset}
      />
    );
  }

  return null;
}