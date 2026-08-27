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
  OTHER: "other",
} as const;

export type Vertical = (typeof Vertical)[keyof typeof Vertical];

export const VERTICALS = Object.values(Vertical);

/** Labels for onboarding UI (en). */
export const VERTICAL_LABELS: Record<Vertical, string> = {
  salon: "Salon",
  clinic: "Clinic",
  restaurant: "Restaurant",
  car_rental: "Car Rental",
  real_estate: "Real Estate",
  gym: "Gym",
  retail: "Retail",
  events: "Events",
  home_services: "Home Services",
  sme: "SME",
  other: "Other",
};
