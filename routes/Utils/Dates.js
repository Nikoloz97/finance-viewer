export const getMonthIndex = (stringDateInput) => {
  // TODO: Weird conversion problem - 10-31-2024 got converted to October 30th
  const date = new Date(stringDateInput);

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
    return month - 1;
  } else {
    throw new Error("Date input is outside the valid bounds");
  }
};

export const getCutOffDate = (stringDateInput, monthModifierInteger) => {
  let cutOffDate = new Date(stringDateInput);

  const month = cutOffDate.getMonth(); // Note: months are 0-indexed (0 = January, 11 = December)
  const day = cutOffDate.getDate();

  if (day > 5 && day < 25) {
    throw new Error("Date input is outside the valid bounds");
  }

  if (day <= 5) {
    cutOffDate = cutOffDate.setMonth(month - 1);
  }

  cutOffDate.setDate(25);
  cutOffDate.setMonth(month + monthModifierInteger);

  return cutOffDate;
};
