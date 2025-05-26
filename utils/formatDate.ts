export function formatDate(dateString: string, withDayName = false): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: withDayName ? "long" : undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Locale Indonesia
  return date.toLocaleDateString("id-ID", options);
}
