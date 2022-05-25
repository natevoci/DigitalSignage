import React from 'react';

import { Carousel, Events } from '../../ui';

export const Pane = ({
  sourceQuery
}) => {
  const [timeOffsetMinutesManual, setTimeOffsetMinutesManual] = React.useState(0);
  window.setTimeOffsetMinutesManual = setTimeOffsetMinutesManual;

  const [sourceType, ...sourceDetailsArray] = sourceQuery.split(':');
  const sourceDetails = sourceDetailsArray.join(':');
  console.log(JSON.stringify({
    sourceType,
    sourceDetailsArray,
    sourceDetails,
    timeOffsetMinutesManual,
  }));

  if (sourceType === 'category') {
    const sources = sourceDetails?.split(',')?.map(val => `https://digitalsignage.manninghamuc.org/category/${val}/feed/`);

    return sources ? (
      <Carousel
        categories={sources}
      />
    ) : null;
  }

  if (sourceType === 'events') {
    const [calendarId, apiKey, offset = '0'] = sourceDetails?.split(':') || [];
    const timeOffsetMinutes = parseInt(offset) + timeOffsetMinutesManual;

    return (
      <Events
        calendarId={calendarId}
        apiKey={apiKey}
        timeOffsetMinutes={timeOffsetMinutes}
      />
    );
  }

  return null;
}