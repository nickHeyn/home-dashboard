export interface CalendarEvent {
    readonly name: string;
    readonly description?: string;
    readonly start: Date;
    readonly end?: Date;
    readonly isRecurring: boolean;
    readonly isAllDayEvent: boolean;
}

export interface Calendar {
    readonly events: CalendarEvent[];
}