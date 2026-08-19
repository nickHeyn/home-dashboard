"use client";

import { useEffect, useState, useMemo } from "react";
import { DateTime } from "luxon";
import { CalDay, CalEvent } from "./types/calendar";
import { Calendar } from "@/types/calendar";

const NUM_DAYS = 5;
const TIMEZONE = "America/Chicago";

export default function CalendarPage() {
  const [calData, setCalData] = useState<Calendar | null | undefined>();

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then(setCalData);
  }, []);

  const getEventRangeString = (event: CalEvent) => {
    if (event.isAllDayEvent) {
      return "All Day";
    }

    if (event.end) {
      return `${event.start.toLocaleString(DateTime.TIME_SIMPLE)} - ${event.end.toLocaleString(DateTime.TIME_SIMPLE)}`;
    }

    return `${event.start.toLocaleString(DateTime.TIME_SIMPLE)}`;
  };

  const dayRanges = useMemo(() => {
    let current = DateTime.now();
    const ranges = [];

    for (let i = 0; i < NUM_DAYS; i++) {
      const start = current.startOf("day");
      const end = current.plus({days: 1}).startOf("day");
      ranges.push({
        start,
        end,
        dayTitle: current.toFormat("ccc LLL dd"),
      });

      current = current.plus({ days: 1 });
    }

    return ranges;
  }, []);

  const daysWithEvents: CalDay[] = useMemo(() => {
    const events = calData?.events ?? [];

    const result: CalDay[] = [];

    for (const range of dayRanges) {
      const eventsOnThisDay = events
        .map((ev) => {
          return {
            ...ev,
            start: DateTime.fromJSDate(new Date(ev.start), {zone: 'UTC'}),
            end: ev.end ? DateTime.fromJSDate(new Date(ev.end), {zone: 'UTC'}) : undefined,
          };
        })
        .filter((event) => {
          const eventEnd = event.end ?? event.start;
          console.log("event.start", event.start);
          console.log("eventEnd", eventEnd);
          console.log("range.start", range.start);
          console.log("range.end", range.end);  
          return event.start < range.end && eventEnd > range.start;
        });
      result.push({
        dayTitle: range.dayTitle,
        start: range.start,
        end: range.end,
        events: eventsOnThisDay,
      });
    }

    return result;
  }, [dayRanges, calData]);

  console.log("calData", calData);

  console.log("dayRanges", dayRanges);

  console.log("daysWithEvents", daysWithEvents);
  
  return (
    <main className=" font-serif h-screen">
      <div className="flex flex-row flex-1 w-full items-center justify-between py-16 px-1 sm:items-start h-full">
        {daysWithEvents.map((day, index) => (
          <div
            key={day.start.toISO()}
            className="flex flex-col w-full items-center justify-center h-full"
          >
            <span className="font-bold text-2xl underline">{day.dayTitle}</span>
            <ul
              className={
                index > 0
                  ? "border-l-1 h-full border-gray-200 border-opacity-50 flex-1 min-w-0 w-full"
                  : "h-full flex-1 min-w-0 w-full"
              }
            >
              {day.events.map((dayEvent, index) => (
                <li key={index} className="py-2 px-4">
                  <div>
                    <span className="font-bold">{getEventRangeString(dayEvent)}</span>
                  </div>
                  <div>{dayEvent.name}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
