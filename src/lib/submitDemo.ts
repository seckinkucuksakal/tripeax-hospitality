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
          "how many locations do you have": data.locations,
          "calls per day": data.callsPerDay,
          "reservation system": data.reservationSystem,
          Description: data.description,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("sheetdb_request_failed");
  }
}
