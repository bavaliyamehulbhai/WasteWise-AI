export function formatScanDate(date) {
  const scanDate = new Date(date);
  const now = new Date();

  const diff =
    now.getTime() -
    scanDate.getTime();

  const day =
    1000 * 60 * 60 * 24;

  if (diff < day) {
    return "Today";
  }

  if (diff < day * 2) {
    return "Yesterday";
  }

  return scanDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}
