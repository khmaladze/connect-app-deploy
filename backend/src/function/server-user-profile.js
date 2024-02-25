// Define a union type for Zodiac Signs
const zodiacs = [
  "Aquarius",
  "Pisces",
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
];

// Function to determine Zodiac Sign based on birth month and day
const getZodiacSign = (month, day) => {
  // Array of Zodiac Sign start dates in the format [month, day]
  const zodiacDates = [
    [1, 20],
    [2, 19],
    [3, 21],
    [4, 20],
    [5, 21],
    [6, 21],
    [7, 23],
    [8, 23],
    [9, 23],
    [10, 23],
    [11, 22],
    [12, 22],
  ];

  // Find the index of the Zodiac Sign based on the birth month and day
  const index = zodiacDates.findIndex(
    ([zodiacMonth, zodiacDay]) => month === zodiacMonth && day >= zodiacDay
  );

  // Return the corresponding Zodiac Sign or default to Capricorn
  return zodiacs[index !== -1 ? index : 11];
};

// Function to check if a date is valid
const isValidDate = (year, month, day) => {
  // Check if the month is within a valid range
  if (month < 1 || month > 12) {
    return false;
  }

  // Get the number of days in the specified month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Check if the day is within a valid range for the specified month
  if (month === 2 && day > 29) {
    return false;
  } else if (day < 1 || day > daysInMonth) {
    return false;
  }

  // If both conditions are met, the date is valid
  return true;
};

// Function to get the date after 7 days in ISO format
const getDateAfter7Days = () => {
  const currentDate = new Date(); // Get the current date and time
  const futureDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days (in milliseconds)

  return futureDate.toISOString();
};

module.exports = {
  getZodiacSign,
  isValidDate,
  getDateAfter7Days,
};
