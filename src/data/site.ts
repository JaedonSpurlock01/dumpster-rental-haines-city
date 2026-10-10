export const business = {
  name: "Dumpster Rentals Haines City",
  shortName: "Dumpster Rentals Haines City",
  city: "Haines City",
  region: "Florida",
  phoneDisplay: "(863) 695-2087",
  phoneHref: "tel:+18636952087",
  email: "info@dumpsterrentalshainescity.com",
  url: "https://dumpsterrentalshainescity.com",
  hoursDisplay: "Mon - Sat: 7am - 7pm",
  openingHours: "Mo-Sa 07:00-19:00",
} as const;

export const services = [
  {
    name: "Residential Dumpster Rental",
    shortName: "Residential Dumpsters",
    slug: "/services/residential-dumpster-rental/",
    description:
      "Keep home cleanouts, renovations, and yard projects organized with a roll-off container placed where you can use it.",
  },
  {
    name: "Construction Dumpster Rental",
    shortName: "Construction Dumpsters",
    slug: "/services/construction-dumpster-rental/",
    description:
      "Create a central debris area for remodels, roofing work, and active job sites with scheduled delivery and pickup.",
  },
  {
    name: "Commercial Dumpster Rental",
    shortName: "Commercial Dumpsters",
    slug: "/services/commercial-dumpster-rental/",
    description:
      "Support property cleanups, tenant improvements, and business projects with practical temporary waste capacity.",
  },
] as const;

export const faqs = [
  {
    question: "How does dumpster rental in Haines City work?",
    answer:
      "Call or request a free estimate with details about your project, debris, available space, and timing. We will help you choose an appropriate container, review placement and material guidelines, then coordinate delivery and pickup.",
  },
  {
    question: "What size dumpster should I rent?",
    answer:
      "The right size depends on debris type, total volume, project area, and site access. A garage cleanout may need less capacity than a full renovation. Tell us what you are removing so we can recommend an option without making you guess.",
  },
  {
    question: "What can I put in a roll-off dumpster?",
    answer:
      "Many household, construction, and commercial project materials may be accepted, but restrictions vary. Paint, chemicals, batteries, tires, appliances, electronics, and other regulated items may require separate handling. Confirm every material before loading.",
  },
  {
    question: "Where can the dumpster be placed?",
    answer:
      "A firm, level, accessible surface is usually best. Driveways and designated job-site areas are common choices. The delivery path also needs enough width and overhead clearance. We can discuss access before scheduling.",
  },
  {
    question: "How high can I fill the container?",
    answer:
      "Keep all debris at or below the marked fill line and inside the container walls. Overfilled containers can create unsafe transport conditions and may require material to be removed before pickup.",
  },
  {
    question: "How much does a dumpster rental cost?",
    answer:
      "Pricing depends on container size, debris type, rental period, delivery details, and disposal weight. Request a free estimate for your project so you can review the expected terms before scheduling.",
  },
  {
    question: "Do I need a permit for a dumpster in Haines City?",
    answer:
      "A container kept entirely on private property may not need the same approval as one placed on a street, sidewalk, or public right-of-way. Rules depend on the exact location and project. Confirm current requirements with Haines City and obtain property-owner approval before scheduling.",
  },
] as const;

export type ServiceName = (typeof services)[number]["name"];
