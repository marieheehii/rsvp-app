import { strings } from "../strings";

export function downloadCalendarEvent() {
    const title = "Baby Shower";
    const description = "Come celebrate our little honey on the way!";
    const location = strings.eventLocation ?? "";
    const start = "20260919T130000";
    const end = "20260919T170000";

    // Modern iOS detection without navigator.platform
    const isiOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (!!(window as any).MSStream);

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${start}
DTEND:${end}
UID:emir-${strings.eventLocation}@baby-shower
END:VEVENT
END:VCALENDAR
`.trim();

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

    if (isiOS) {
        // iOS Safari often requires direct object URLs with a click
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "baby-shower.ics";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } else {
        // Desktop / Android: same approach works fine
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "baby-shower.ics";
        a.click();
        URL.revokeObjectURL(url);
    }
}