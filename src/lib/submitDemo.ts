/**
 * SheetDB / Google Sheet row 1 headers (exact match required):
 * time | first name | last name | email | phone number | business name | business type |
 * what are you looking for | number of locations or properties | estimated daily calls |
 * reservation system or PMS | rooms across all properties | Description
 *
 * Mapping from modal:
 * - number of locations or properties → restaurant: location band; hotel: property count band
 * - estimated daily calls → restaurant: calls band; hotel: empty
 * - reservation system or PMS → restaurant: reservation tool; hotel: PMS
 * - rooms across all properties → restaurant: empty; hotel: rooms band (all properties)
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

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [
        {
          time: formatTimeForSheet(),
          "first name": data.firstName,
          "last name": data.lastName,
          email: data.email,
          "phone number": phoneForSheet(data.phone),
          "business name": data.businessName,
          "business type": data.businessType,
          "what are you looking for": data.goal,
          "number of locations or properties": data.locations,
          "estimated daily calls": data.callsPerDay,
          "reservation system or PMS": data.reservationSystem,
          "rooms across all properties": data.roomsAcrossAllProperties,
          Description: data.description,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("sheetdb_request_failed");
  }
}
