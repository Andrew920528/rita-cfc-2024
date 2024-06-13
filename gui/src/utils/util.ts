export function formatDate(date: Date): string {
  const padZero = (num: number): string => (num < 10 ? "0" : "") + num;

  const year = date.getFullYear().toString().slice(-2);
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}
