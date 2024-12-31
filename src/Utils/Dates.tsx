export const determineMonthIndex = (dateInput: string) => {
  // Parse the input date (TODO: is this necessary? )
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const month = date.getMonth(); // Note: months are 0-indexed (0 = January, 11 = December)
  const day = date.getDate();

  const startBound = 25;
  const endBound = 5;

  if (day >= startBound) {
    return month;
  } else if (day <= endBound) {
    return month + 1;
  } else {
    throw new Error("Date input is outside the valid bounds");
  }
};
