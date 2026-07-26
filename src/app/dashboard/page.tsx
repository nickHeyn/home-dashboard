'use client'

import { useEffect, useState, useMemo } from "react";
import { DateTime } from "luxon";
import { CalDay } from "./types/calendar";
import { Calendar } from "@/types/calendar";

const NUM_DAYS = 5;


export default function Dashboard()  {
  const [calData, setCalData] = useState<Calendar | null | undefined>();

  useEffect(() => {
    fetch('/api/calendar')
    .then(res => res.json())
    .then(setCalData)
  }, []);

  const dayRanges = useMemo(() => {
    let current = DateTime.now();
    const ranges = []

    for(let i = 0; i < NUM_DAYS; i++) {
        const start = current.startOf('day');
        const end = current.endOf('day');
        ranges.push({
            start,
            end,
            dayTitle: current.toFormat('ccc LLL dd')
            
        });

        current = current.plus({days: 1}); 
    }

    return ranges;
  }, []);

  const daysWithEvents: CalDay[] = useMemo(() => {
    const events = calData?.events ?? [];

    const result: CalDay[] = [];

    for(const range of dayRanges) {
            const eventsOnThisDay = events
                .map((ev) => {
                    return {...ev,
                    start: DateTime.fromJSDate(new Date(ev.start)),
                    end: ev.end ? DateTime.fromJSDate(new Date(ev.end)) : undefined
                }})
                .filter(event => {
                    const eventEnd = event.end ?? event.start;
                    return event.start <= range.end && eventEnd >= range.start
                })
        result.push({
            dayTitle: range.dayTitle,
            start: range.start,
            end: range.end,
            events: eventsOnThisDay,
        });
            
    }

    return result;
  }, [dayRanges, calData]);

  console.log(daysWithEvents);

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-row flex-1 w-full items-center justify-between py-16 px-1 sm:items-start">
        {daysWithEvents.map((day) => (
            <div key={day.start.toISO()}>
                <div>
                    {day.dayTitle}
                </div>
                <ul>
                    {day.events.map((dayEvent) => (
                        <li key={dayEvent.start.toISO()}>
                            <div>
                                <span>{!dayEvent.isRecurring && dayEvent.end ? `${dayEvent.start.toLocaleString(DateTime.TIME_SIMPLE)} - ${dayEvent.end.toLocaleString(DateTime.TIME_SIMPLE)}` : 'All Day'}</span>
                            </div>
                            <div>
                                {dayEvent.name}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </main>
    </div>
  );
}
