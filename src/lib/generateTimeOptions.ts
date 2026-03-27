/** 30-minute slots from 07:00 through 23:00, then 00:00–03:00 (late close), matching onboarding HTML. */
export function generateTimeOptions30(): string[] {
  const options: string[] = [];
  const step = 30;
  const startHour = 7;
  const endHour = 23;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += step) {
      if (hour === endHour && min > 0) break;
      options.push(`${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }
  }

  for (let hour = 0; hour <= 3; hour++) {
    for (let min = 0; min < 60; min += step) {
      if (hour === 3 && min > 0) break;
      options.push(`${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    }
  }

  return options;
}
