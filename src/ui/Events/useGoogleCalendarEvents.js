import React from 'react';

export const useGoogleCalendarEvents = ({
  calendarId,
  apiKey,
  dayOffset,
  fetchInterval = 30000,
} = {}) => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(
    () => {
      let latestEvents = events;

      const fetchEvents = async () => {
        console.log(`fetching events from ${calendarId}`)
        const dateStart = new Date();
        dateStart.setHours(0,0,0,0);
        if (dayOffset !== 0) {
          dateStart.setDate(dateStart.getDate() + dayOffset);
        }

        const dateEnd = new Date(dateStart);
        dateEnd.setDate(dateEnd.getDate() + 1);

        const query = [
          `key=${apiKey}`,
          `timeMin=${dateStart.toISOString()}`,
          `timeMax=${dateEnd.toISOString()}`,
          `singleEvents=True`,
        ];
        const fetchURL = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query.join('&')}`;
        console.log(fetchURL);

        const eventsResponse = await fetch(fetchURL);
        const eventsJSON = await eventsResponse.json();
      
        const events = eventsJSON.items
          .map(event => ({
            ...event,
            startDate: new Date(event.start.dateTime),
            endDate: new Date(event.end.dateTime),
          }))
          .filter(event => event.status === 'confirmed' && event.startDate >= dateStart)
          .sort((a, b) => a.startDate - b.startDate);
  
        if (JSON.stringify(latestEvents) !== JSON.stringify(events)) {
          console.log('New events array', events);
          setEvents(events);
          latestEvents = events;
        }
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
    [],
  );

  return events;
};
