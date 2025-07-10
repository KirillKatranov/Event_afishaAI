export const Services: Service[] = [
  { id: "events", name: "Мероприятия", illustration: "events", description: "Актуальные мероприятия и интересные события в Вашем городе" },
  { id: "places", name: "Места", illustration: "places", description: "Лучшие локации для отдыха и развлечений" },
  { id: "organizers", name: "Организаторы", illustration: "organizers", description: "Организация мероприятий для юридических лиц" },
  { id: "trips", name: "Маршруты", illustration: "trips", description: "Лучшие туристические маршруты по городу" },
]

export const ServicesColors = {
  events: "#FF47FF",
  places: "#E1F44B",
  organizers: "#6361DD",
  trips: "#A32EFF",
}

export const ServicesGradients = {
  events: ["#FFD866", "#FF47FF"],
  places: ["#E1F44B", "#5CFFA2"],
  organizers: ["#77DAFF", "#6361DD"],
  trips: ["#CB4EE7", "#7831F5"],
}

export type Service = {
  id: "events" | "places" | "organizers" | "trips";
  name: "Мероприятия" | "Места" | "Организаторы" | "Маршруты";
  illustration: "events" | "places" | "organizers" | "trips";
  description: string;
}
