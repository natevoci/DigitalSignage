import React from 'react';
import styled from '@emotion/styled';

import { useGoogleCalendarEvents } from './useGoogleCalendarEvents';

const colorWhite = '#fff';
const colorGrey = '#b1b3bb';

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

color: ${p => p.$color};
border-top: ${p => p.$color} 1px solid;
padding-top: 20px;
`;

const EventRow = styled.div`
  margin: 10px 0;
  color: ${p => p.$past ? colorGrey : 'inherit'};
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
  opacity: ${p => p.$visible ? '1' : '0'};
  color: ${colorGrey};
`;

export const Events = ({
  calendarId,
  apiKey,
  dayOffset = 0,
  timeOffsetMinutes = 0,
}) => {

  const getNow = () => new Date((new Date()).getTime() + timeOffsetMinutes*60000);
  const [currentTime, setCurrentTime] = React.useState(getNow());

  const eventsToday = useGoogleCalendarEvents({
    calendarId,
    apiKey,
    dayOffset,
    currentTime,
  });

  const eventsTomorrow = useGoogleCalendarEvents({
    calendarId,
    apiKey,
    dayOffset: dayOffset + 1,
    currentTime,
  });

  React.useEffect(
    () => {
      let time = currentTime;

      const handle = setInterval(
        () => {
          const now = getNow();
          if (now.getMinutes() !== time?.getMinutes?.()) {
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
    [timeOffsetMinutes],
  );

  React.useEffect(
    () => {
      setCurrentTime(getNow());
    },
    [timeOffsetMinutes],
  );

  const [hiddenEventCount, setHiddenEventCount] = React.useState(0);

  const visibleEvents = React.useMemo(
    () => eventsToday.slice(hiddenEventCount),
    [eventsToday, hiddenEventCount],
  );

  const [tomorrowVisible, setTomorrowVisible] = React.useState(true);
  const todayDivRef = React.useRef(null);
  React.useLayoutEffect(
    () => {
      if (todayDivRef.current) {
        const bottom = todayDivRef.current.offsetTop + todayDivRef.current.offsetHeight;

        const visible = bottom <= 1080 * .80;
        setTomorrowVisible(visible);
      }
    },
    [todayDivRef.current, eventsToday],
  );

  React.useLayoutEffect(
    () => {
      if (todayDivRef.current) {
        const bottom = todayDivRef.current.offsetTop + todayDivRef.current.offsetHeight;

        if (bottom > 1080 && visibleEvents[0]?.endDate < currentTime) {
          setHiddenEventCount(hiddenEventCount + 1);
        }
      }
    },
    [todayDivRef.current, visibleEvents, hiddenEventCount],
  )

  React.useEffect(
    () => {
      setHiddenEventCount(0);
    },
    [eventsToday],
  );

  const currentTimeString = toLocaleString(currentTime)

  return (
    <Wrapper>
      <div
        ref={todayDivRef}
      >
        <Title>Today's events</Title>
        <SubTitle>{currentTimeString}</SubTitle>

        {renderEventList(visibleEvents, currentTime, colorWhite)}
      </div>

      {eventsTomorrow.length ? (
        <Tomorrow
          $visible={tomorrowVisible}
        >
          <Title>Tomorrow</Title>
          {renderEventList(eventsTomorrow, currentTime, colorGrey)}
        </Tomorrow>
      ) : null}
    </Wrapper>
  );
};

const renderEventList = (events, currentTime, color) => {
  return (
    <EventsList
      $color={color}
    >
      {events.length ? (
        events.map(event => (
          <EventRow
            key={event.etag}
            $past={event.endDate < currentTime}
          >
            <EventDate>
              {toLocaleTimeString(event.startDate)}
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

const toLocaleTimeString = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
};

const toLocaleDateString = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const toLocaleString = (date) => {
  return `${toLocaleDateString(date)}, ${toLocaleTimeString(date)}`;
};
