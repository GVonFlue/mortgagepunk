/**
 * Mortgage Punk: website leads -> Google Sheet + email.
 *
 * Every form on mortgagepunk.com posts here (through the site's /api/lead,
 * never from the browser). Each lead becomes a row on the tab for its kind
 * (Ticket list, Book Chris, Ask Mortgage Punk, Calls booked, Contact forms)
 * and an email to everyone in NOTIFY.
 *
 * SET UP, ONCE:
 *   1. Make a new Google Sheet (e.g. "Mortgage Punk Website Leads").
 *   2. Extensions -> Apps Script. Delete what's there, paste this whole file.
 *   3. Put the right email address(es) in NOTIFY below. Save.
 *   4. Deploy -> New deployment -> type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Approve the permissions it asks for (Sheets + send email as you).
 *   5. Copy the Web app URL (ends in /exec).
 *   6. Vercel -> mortgagepunk -> Settings -> Environment Variables:
 *        Name LEAD_ENDPOINT, value = that URL, all environments. Save.
 *      Then Deployments -> the latest -> Redeploy.
 *
 * Changing this script later: Deploy -> Manage deployments -> edit (pencil)
 * -> Version: New version -> Deploy. That keeps the same URL, so Vercel
 * doesn't need touching.
 */

// Who gets an email for every lead. Separate several with commas.
var NOTIFY = "CHRIS_EMAIL_HERE";

// The site's code names for each form -> the tab and the email subject.
var KINDS = {
  "waitlist": "Ticket list",
  "booking": "Book Chris",
  "chat": "Ask Mortgage Punk",
  "calendly-booking": "Calls booked"
};
var HEADERS = ["Received", "First", "Last", "Email", "Phone", "Looking for", "Notes", "Source"];

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var kind = KINDS[d.source] || "Contact forms";

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(kind) || ss.insertSheet(kind);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    // A leading ' stops a phone like +13165550100 being read as a formula.
    var safe = function (v) { v = String(v == null ? "" : v); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    sh.appendRow([
      new Date(),
      safe(d.first), safe(d.last), safe(d.email), safe(d.phone),
      safe(d.intent), safe(String(d.notes || "").slice(0, 45000)), safe(d.source)
    ]);

    if (NOTIFY && NOTIFY.indexOf("@") > 0) {
      var name = [d.first, d.last].filter(String).join(" ") || "Someone";
      var body = [
        "New lead from mortgagepunk.com: " + kind,
        "",
        "Name:  " + name,
        "Email: " + (d.email || "-"),
        "Phone: " + (d.phone || "-"),
        "Looking for: " + (d.intent || "-"),
        "",
        String(d.notes || "").slice(0, 8000),
        "",
        "All leads: https://mortgagepunk.com/backstage/leads",
        "This sheet: " + ss.getUrl()
      ].join("\n");
      var mail = { to: NOTIFY, subject: "New lead: " + kind + " - " + name, body: body };
      // Hitting Reply in the email answers the lead, not the script.
      if (d.email && String(d.email).indexOf("@") > 0) mail.replyTo = String(d.email);
      MailApp.sendEmail(mail);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
