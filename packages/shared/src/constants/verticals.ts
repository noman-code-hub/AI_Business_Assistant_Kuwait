export const Vertical = {
  SALON: "salon",
  CLINIC: "clinic",
  RESTAURANT: "restaurant",
  CAR_RENTAL: "car_rental",
  REAL_ESTATE: "real_estate",
  GYM: "gym",
  RETAIL: "retail",
  EVENTS: "events",
  HOME_SERVICES: "home_services",
  SME: "sme",
} as const;

export type Vertical = (typeof Vertical)[keyof typeof Vertical];

export const VERTICALS = Object.values(Vertical);
