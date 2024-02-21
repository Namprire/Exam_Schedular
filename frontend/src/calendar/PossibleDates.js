/**
 * Calculates the possible dates within a given range that are not weekends (Saturday or Sunday) and do not conflict with events in the eventsApp array.
 * @param {string[]} range - An array of two strings representing the start and end dates in the format 'yyyy-mm-dd'.
 * @param {object[]} eventsApp - An array of objects representing events with start and end attributes in the format 'yyyy-mm-dd'.
 * @returns {Date[]} An array of Date objects representing the possible dates within the range.
 * @throws {Error} If the input is invalid, an error is thrown.
 */
export function calculatePossibleDates(range, eventsApp) {
  // Validate the input
  if (
    !Array.isArray(range) ||
    range.length !== 2 ||
    !range.every((date) => typeof date === "string")
  ) {
    throw new Error("Invalid input. Expected an array of two strings.");
  }

  // Parse the start and end dates
  const [start, end] = range.map((date) => new Date(date));

  // Generate the dates
  const dates = [];
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    // Check if the date is a Saturday or Sunday
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    // Check if the date is in eventsApp or within the range of the start and end attributes of the events
    const dateString = date.toISOString().split("T")[0]; // Convert date to string in the format 'yyyy-mm-dd'
    if (
      eventsApp.some((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = event.end ? new Date(event.end) : eventStart;
        return (
          dateString === event.start || (date >= eventStart && date <= eventEnd)
        );
      })
    ) {
      continue;
    }

    dates.push(new Date(date)); // Create a new Date object to avoid mutating the original date
  }

  // Return the dates
  return dates;
}
