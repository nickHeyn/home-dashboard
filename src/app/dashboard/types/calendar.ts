import { DateTime } from "luxon";

export interface CalDay {
  readonly dayTitle: string;
  readonly start: DateTime;
  readonly end: DateTime;
  readonly events: CalEvent[];
}

export interface CalEvent {
  readonly name: string;
  readonly description?: string;
  readonly start: DateTime;
  readonly end?: DateTime;
  readonly isRecurring: boolean;
  readonly isAllDayEvent: boolean;
}
