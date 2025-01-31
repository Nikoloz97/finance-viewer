import { Decimal128 } from "mongodb";

export function toDollarAmount(number) {
  const formattedValue = Number(number).toFixed(2);
  return Decimal128.fromString(formattedValue);
}

export function toDateOnly(dateTime) {
  return dateTime.split("T")[0];
}
