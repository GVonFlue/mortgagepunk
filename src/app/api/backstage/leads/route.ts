import { requireSession } from "@/lib/auth";
import { getLeads } from "@/lib/db";
import { LEAD_KINDS, isLeadKind, kindOf } from "@/lib/leadTypes";

export const runtime = "nodejs";

/**
 * Backstage → Leads → Download. One kind of lead as a spreadsheet file
 * (CSV, opens in Excel, Numbers or Google Sheets), or every lead with a
 * Type column when no kind is given.
 *
 * Behind the Backstage sign-in, like everything that can read a lead.
 */
export async function GET(req: Request) {
  if (!(await requireSession())) {
    return new Response("Not signed in", { status: 401 });
  }
  const type = new URL(req.url).searchParams.get("type");
  const kind = isLeadKind(type) ? type : null;
  const all = await getLeads(5000);
  const rows = kind ? all.filter((l) => kindOf(l.source) === kind) : all;

  // Quote every cell, double any quotes, and stop a cell that starts with
  // = + - @ from being run as a formula when the file is opened.
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    // A phone number like +13165550100 is left alone; anything else that
    // starts like a formula gets a leading apostrophe.
    if (/^[=+\-@]/.test(s) && !/^\+?[\d\s().-]+$/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const label = (k: string) => LEAD_KINDS.find((x) => x.key === k)?.label ?? k;
  const head = ["Received", "Type", "First", "Last", "Email", "Phone", "Looking for", "Notes"];
  const lines = [
    head.map(cell).join(","),
    ...rows.map((l) =>
      [
        new Date(l.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" }),
        label(kindOf(l.source)),
        l.first, l.last, l.email, l.phone, l.intent, l.notes,
      ].map(cell).join(",")
    ),
  ];
  const name = `mortgage-punk-leads-${kind ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
  // A BOM so Excel reads the file as UTF-8 rather than mangling names.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
