import { permanentRedirect } from "next/navigation";

/**
 * /contact — retired. Permanently redirects to /book.
 *
 * This was a generic lead form: a lending intake with three cards above it
 * saying speaking and press go to Ashley. Every booking link on the site sent
 * people here and then asked them whether they were buying a home. Booking
 * requests now have their own page, and lending has the application portal
 * and the assistant.
 *
 * Kept as a redirect rather than deleted because /contact has been live and
 * indexed, and has been pasted into emails and printed materials. A 308 hands
 * any search standing to /book and sends every old link somewhere that works;
 * a deleted page would 404 all of them.
 */
export default function Contact() {
  permanentRedirect("/book");
}
