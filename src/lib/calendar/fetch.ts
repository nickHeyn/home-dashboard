import * as ical from 'node-ical'
import { DateTime } from 'luxon';
import { Calendar, CalendarEvent } from '@/types/calendar';
import { VEvent } from 'node-ical';
const TIMEZONE = 'America/Chicago';
const NUM_DAYS = 5;


function getRangeStartTime(): Date {
    const startOfChicagoToday = DateTime.now()
    .setZone(TIMEZONE)
    .startOf('day')
    .toJSDate(); // Converts back to native JS Date object
    startOfChicagoToday.setHours(0,0,0,0);
    return startOfChicagoToday;
}

function getRangeEndTime(startTime: Date): Date {
    return DateTime.fromJSDate(startTime).plus({ days: NUM_DAYS}).toJSDate()
}

function mapToCalendarEvent(
  event: VEvent,
  overrideStart?: Date,
  overrideEnd?: Date
): CalendarEvent {
  const start = overrideStart ?? event.start
  const end = overrideEnd ?? event.end

  return {
    name: event.summary.toString(),
    description: event.description?.toString(),
    start,
    end,
    isRecurring: Boolean(event.rrule),
    isAllDayEvent: event.datetype === 'date',
  }
}

export async function getCalendarData(): Promise<Calendar> {
    const googleCalUrl = process.env.GOOGLE_CAL_ICS_URL;
    if(!googleCalUrl) {
        throw new Error('No Calendar URL');
    }

    const rangeStart = getRangeStartTime();
    const rangeEnd = getRangeEndTime(rangeStart);

    const eventData = await ical.async.fromURL(googleCalUrl);

    const resultingEvents: CalendarEvent[] = [];

    for (const ev in eventData) {
        const event = eventData[ev]
        if (event && event.type === 'VEVENT') {
            if(event.rrule) {
                // recurring event
                const instances = event.rrule.between(rangeStart, rangeEnd)
                for(const instanceStart of instances) {
                    const dateKey = instanceStart.toISOString().slice(0, 10);
                    const endTime = event.end ? event.end.getTime() : instanceStart.getTime()
                    const duration = endTime - event.start.getTime()
                    const override = event.recurrences?.[dateKey]
                    const isExcluded = event.exdate && Object.keys(event.exdate).some(exd => exd.slice(0, 10) === dateKey)
                    if (isExcluded) {
                        continue
                    }

                    if(override) {
                        resultingEvents.push(mapToCalendarEvent(override))
                    }
                    else {
                        const instanceEnd = new Date(instanceStart.getTime() + duration)
                        resultingEvents.push(mapToCalendarEvent(event, instanceStart, instanceEnd));
                    }
                }
            }
            else {
                // standard event
                if (event.start >= rangeStart && event.start <= rangeEnd) {
                    resultingEvents.push(mapToCalendarEvent(event));
                }
            }
        } 
    }

    // sort events
    resultingEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

    return {
        events: resultingEvents
    };
}