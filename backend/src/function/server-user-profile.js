function getZodiacSign(month, day) {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Pisces";
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius";
  } else {
    return "Capricorn";
  }
}

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
