import { format, isSameDay, isYesterday } from 'date-fns';

export function formatConversationTimestamp(ts) {
  if (!ts) return '';

  const date = new Date(ts);
  const now = new Date();

  if (isSameDay(date, now)) {
    // Today -> exact time
    return format(date, 'h:mm aa'); // e.g. "6:13 PM"
  }

  if (isYesterday(date)) {
    // Yesterday
    return 'Yesterday';
  }

  // Older -> exact date
  return format(date, 'dd/MM/yyyy'); // e.g. "12/09/2025"
}
