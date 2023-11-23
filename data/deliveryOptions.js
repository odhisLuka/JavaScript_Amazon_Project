// This is a ESM version of dayJS external library. Creates a function dayjs()
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption;
}
// checks if day is weekeend
function isWeekend(date) {
  const dayOfWeek = date.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}

// make this function skip weekends

export function calculateDeliveryDate(deliveryOption) {
  /* 
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, `days`);
  */

  // Get the number of days we need to add
  // Use while loop and each time, add 1 day,
  // then check if its the weekend and decrease the remaining days to add
  // If the day is a weekend, skip decreasing the remaining days

  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, "day");

    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }
  const dateString = deliveryDate.format(`dddd, MMMM D`);
  return dateString;
}
