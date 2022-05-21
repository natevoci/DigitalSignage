import React from 'react';
import styled from '@emotion/styled';

import { useGoogleCalendarEvents } from './useGoogleCalendarEvents';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 50px;
`;

const SubTitle = styled.h3`
  text-align: center;
  font-size: 30px;

  padding-bottom: 10px;
`;

const EventsList = styled.div`
font-size: 40px;
line-height: 50px;

border-top: #fff 1px solid;
padding-top: 20px;
`;

const EventRow = styled.div`
  margin: 10px 0;
`;

const EventDate = styled.div`
  display: inline-block;
  width: 21%;
  margin-right: 4%;
  vertical-align: top;
  text-align: right;
`;

const EventSummary = styled.div`
  display: inline-block;
  width: 75%;
  vertical-align: top;
`;

const NoEvents = styled.div`
  display: inline-block;
  text-align: center;
  width: 100%;
  vertical-align: top;
`;

const Tomorrow = styled.div`
  margin-top: 40px;
  opacity: ${p => p.$visible ? '1' : '0'}
`;

export const Events = ({
  calendarId,
  apiKey,
  dayOffset,
}) => {

  const eventsToday = useGoogleCalendarEvents({
    calendarId,
    apiKey,
    dayOffset,
  });

  const eventsTomorrow = useGoogleCalendarEvents({
    calendarId,
    apiKey,
    dayOffset: dayOffset + 1,
  });

  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(
    () => {
      let time = currentTime;
      const handle = setInterval(
        () => {
          const now = new Date();
          if (now.getMinutes() !== time.getMinutes()) {
            time = now;
            setCurrentTime(now);
          }
        },
        1000,
      );

      return () => {
        clearInterval(handle);
      };
    },
    [],
  );

  const [tomorrowVisible, setTomorrowVisible] = React.useState(true);
  const tomorrowRef = React.useRef(null);
  React.useLayoutEffect(
    () => {
      if (tomorrowRef.current) {
        const top = tomorrowRef.current.offsetTop;
        const visible = top <= 1080 * .80;
        console.log({ visible });
        setTomorrowVisible(visible);
      }
    },
    [tomorrowRef.current, eventsToday],
  );

  return (
    <Wrapper>
      <Title>Today's events</Title>
      <SubTitle>{currentTime.toLocaleString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })}</SubTitle>

      {renderEventList(eventsToday)}

      {eventsTomorrow.length ? (
        <Tomorrow
          ref={tomorrowRef}
          $visible={tomorrowVisible}
        >
          <Title>Tomorrow</Title>
          {renderEventList(eventsTomorrow)}
        </Tomorrow>
      ) : null}
    </Wrapper>
  );
};

const renderEventList = (events) => {
  return (
    <EventsList>
      {events.length ? (
        events.map(event => (
          <EventRow
            key={event.etag}
          >
            <EventDate>
              {(new Date(event.start.dateTime)).toLocaleTimeString('en-AU', {
                hour: 'numeric',
                minute: 'numeric',

              })}
            </EventDate>
            <EventSummary>
              {event.summary}
            </EventSummary>
          </EventRow>
        ))
      ) : (
        <EventRow>
          <NoEvents>
            No events
          </NoEvents>
        </EventRow>
      )}
    </EventsList>
  );
}