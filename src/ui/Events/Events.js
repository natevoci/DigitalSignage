import React from 'react';
import styled from '@emotion/styled';

import { useGoogleCalendarEvents } from './useGoogleCalendarEvents';

const Wrapper = styled.div`
  margin: 10px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 50px;
`;

const SubTitle = styled.h3`
  text-align: center;
  font-size: 30px;

  padding-bottom: 20px;
  border-bottom: #fff 1px solid;
  margin-bottom: 50px;
`;

const EventsList = styled.div`
  margin-top: 10px;
  font-size: 40px;
  line-height: 50px;
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

      <EventsList>
        {eventsToday.length ? (
          eventsToday.map(event => (
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
    </Wrapper>
  );
};

