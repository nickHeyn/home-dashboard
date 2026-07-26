import { getCalendarData } from "@/lib/calendar/fetch";

export async function GET(request: Request) {
    const data = await getCalendarData();
    console.log(JSON.stringify(data))
    return Response.json({data});
}

