import { calculatePossibleDates } from "./PossibleDates";

test("calculatePossibleDates function", () => {
  const range = ["2023-10-01", "2023-10-31"];
  const eventsApp = [
    { title: "Event 1", start: "2023-10-03", end: null },
    { title: "Event 2", start: "2023-10-10", end: "2023-10-12" },
  ];

  const result = calculatePossibleDates(range, eventsApp);

  // Check that the result is an array
  expect(Array.isArray(result)).toBe(true);

  // Check that the result does not include weekends or event dates
  const weekendsAndEvents = [
    "2023-10-03", // Event 1
    "2023-10-07", // Saturday
    "2023-10-08", // Sunday
    "2023-10-10", // Event 2
    "2023-10-11", // Event 2
    "2023-10-12", // Event 2
    "2023-10-14", // Saturday
    "2023-10-15", // Sunday
    // ...add more dates as needed
  ].map((date) => new Date(date));

  weekendsAndEvents.forEach((date) => {
    expect(result).not.toContainEqual(date);
  });
});
