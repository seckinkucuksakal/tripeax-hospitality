/**
 * SheetDB JSON keys must match Google Sheet row 1 **exactly** (spacing, capitals, hyphens).
 * Your sheet uses Title Case + "E-mail" + "What are you Looking for" + "Proporties" spelling.
 * If you rename columns in the sheet, update the keys in the object below to match.
 */
export type DemoFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  goal: string;
  locations: string;
  callsPerDay: string;
  reservationSystem: string;
  roomsAcrossAllProperties: string;
  description: string;
};

/** Google Sheets treats leading +, =, -, @ as formula; prefix ' forces plain text. */
function phoneForSheet(phone: string): string {
  const t = phone.trim();
  if (!t) return t;
  if (/^[=+\-@]/.test(t)) return `'${t}`;
  return t;
}

function formatTimeForSheet(d = new Date()): string {
  return (
    d.toLocaleString("en-GB", {
      timeZone: "Europe/Istanbul",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }) + " (Europe/Istanbul)"
  );
}

export async function submitDemo(data: DemoFormData): Promise<void> {
  const url = (import.meta.env.VITE_SHEETDB_API_URL as string | undefined)?.trim();
  if (!url) {
    throw new Error("missing_sheetdb_url");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const bearer = (import.meta.env.VITE_SHEETDB_BEARER_TOKEN as string | undefined)?.trim();
  if (bearer) {
    headers.Authorization = bearer.toLowerCase().startsWith("bearer ")
      ? bearer
      : `Bearer ${bearer}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: [
        {
          Time: formatTimeForSheet(),
          "First Name": data.firstName,
          "Last Name": data.lastName,
          "E-mail": data.email,
          "Phone Number": phoneForSheet(data.phone),
          "Business Name": data.businessName,
          "Business Type": data.businessType,
          "What are you Looking for": data.goal,
          "Number of Locations or Proporties": data.locations,
          "Estimated Daily Calls": data.callsPerDay,
          "Reservation System or PMS": data.reservationSystem,
          "Rooms Across All Proporties": data.roomsAcrossAllProperties,
          Description: data.description,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("sheetdb_request_failed");
  }
}
