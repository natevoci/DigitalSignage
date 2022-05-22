import React from 'react';

import useMemoizedState from '../../core/useMemoizedState';

export const useGoogleCalendarEvents = ({
  calendarId,
  apiKey,
  dayOffset,
  currentTime,
  fetchInterval = 30000,
} = {}) => {
  const [eventsJSON, setEventsJSON] = useMemoizedState([]);
  const [events, setEvents] = useMemoizedState([]);

  const { dateStart, dateEnd } = React.useMemo(
    () => {
      const dateStart = new Date(currentTime);
      dateStart.setHours(0,0,0,0);
      if (dayOffset !== 0) {
        dateStart.setDate(dateStart.getDate() + dayOffset);
      }

      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);
      return {
        dateStart,
        dateEnd,
      };
    },
    [currentTime.toLocaleDateString()],
  );

  React.useEffect(
    () => {
      const fetchEvents = async () => {
        const query = [
          `key=${apiKey}`,
          `timeMin=${dateStart.toISOString()}`,
          `timeMax=${dateEnd.toISOString()}`,
          `singleEvents=True`,
        ];

        const fetchURL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query.join('&')}`;
        console.log(`Fetching events from ${calendarId}`, { fetchURL });

        const eventsResponse = await fetch(fetchURL);
        const eventsJSON = await eventsResponse.json();
      
        setEventsJSON(eventsJSON.items);
      };

      fetchEvents();

      const intervalHandle = setInterval(
        fetchEvents,
        fetchInterval,
      );

      return () => {
        clearInterval(intervalHandle);
      }
    },
    [dateStart, dateEnd],
  );

  React.useEffect(
    () => {
      if (eventsJSON) {
        const events = eventsJSON
          .map(event => ({
            ...event,
            startDate: new Date(event.start.dateTime),
            endDate: new Date(event.end.dateTime),
          }))
          .filter(event => event.status === 'confirmed' && event.startDate >= dateStart)
          .sort((a, b) => a.startDate - b.startDate);
  
        setEvents(events);
      }
    },
    [eventsJSON],
  );

  return events;
};
