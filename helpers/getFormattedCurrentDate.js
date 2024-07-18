
function getFormattedCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  // Function to ensure two digits for month and day
  const formatTwoDigits = (num) => (num < 10 ? "0" + num : num);

  const formattedDate = `${year}-${formatTwoDigits(month)}-${formatTwoDigits(
    day
  )}`;
  return formattedDate;
}

module.exports = getFormattedCurrentDate;
