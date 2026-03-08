import { NextResponse } from "next/server";
import { strings } from "../../utils/strings";

export async function GET() {
    const start = "20260919T130000";
    const end = "20260919T170000";

    const ics = `BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//Baby Shower//EN
        CALSCALE:GREGORIAN
        BEGIN:VEVENT
        UID:babyshower-2026-emir
        DTSTAMP:20260101T000000Z
        SUMMARY:${strings.title}
        DESCRIPTION:${strings.description}
        LOCATION:${strings.eventLocation}
        DTSTART:${start}
        DTEND:${end}
        END:VEVENT
        END:VCALENDAR`;

    return new NextResponse(ics, {
        headers: {
            "Content-Type": "text/calendar",
            "Content-Disposition": "attachment; filename=baby-shower.ics",
        },
    });
}