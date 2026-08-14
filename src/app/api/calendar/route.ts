import { getCalendarData } from "@/lib/calendar/fetch";

export async function GET(request: Request) {
  const data = await getCalendarData();
  return Response.json(data);
}
