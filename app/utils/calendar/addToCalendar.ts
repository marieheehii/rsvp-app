import { strings } from "../strings";

export function addToCalendar() {
    const title = "Baby Shower";
    const description = "Come celebrate our little honey on the way!";
    const location = strings.eventLocation ?? "";
    const start = "20260919T130000";
    const end = "20260919T170000";

    const isiOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isiOS) {
        // iOS Safari needs a full path to the ICS API route
        window.location.href = "/api/calendar";
        return;
    }

    // Other browsers → open Google Calendar
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
    )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(
        location
    )}&dates=${start}/${end}`;

    // Open in a new tab
    window.open(googleUrl, "_blank");
}