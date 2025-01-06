export const getMonthIndex = (dateInput) => {
  if (isNaN(dateInput.getTime())) {
    throw new Error("Invalid date input");
  }

  const month = dateInput.getMonth(); // Note: months are 0-indexed (0 = January, 11 = December)
  const day = dateInput.getDate();

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

export const getCutOffDate = (cutOffDate, monthModifierInteger) => {
  const month = cutOffDate.getMonth(); // Note: months are 0-indexed (0 = January, 11 = December)
  const day = cutOffDate.getDate();

  if (day > 5 && day < 25) {
    throw new Error("Date input is outside the valid bounds");
  }

  if (day <= 5) {
    cutOffDate.setMonth(month - 1);
  }

  cutOffDate.setDate(25);
  cutOffDate.setMonth(month + monthModifierInteger);

  return cutOffDate;
};
