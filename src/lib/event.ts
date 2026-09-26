/**
 * Facts about the American Dream Conference that appear in more than one
 * place and must never disagree between them.
 *
 * WHY NOT IN THE WAITLIST COMPONENT. That file is "use client". A server
 * component importing a value from a client module gets a client reference
 * rather than the value, so the price would render as nothing on /movement
 * while looking correct inside the popup. Shared constants live somewhere
 * neither side owns.
 *
 * WHY NOT IN BACKSTAGE. The conference record is editable there and the price
 * probably belongs in it eventually. It is hard-coded until ticketing is
 * real, so there is one number to change rather than a half-wired field that
 * nobody remembers to fill in.
 */
export const TICKET_PRICE = "$150 per person";
