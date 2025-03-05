export const Services: Service[] = [
  { id: "events", name: "События", illustration: "events", description: "Актуальные мероприятия и интересные события в Вашем городе" },
  { id: "places", name: "Места", illustration: "places", description: "Лучшие локации для отдыха и развлечений" },
  { id: "organizers", name: "Организаторы", illustration: "organizers", description: "В разработке" },
  { id: "trips", name: "Путешествия", illustration: "trips", description: "В разработке" },
]

export const ServicesColors = {
  events: "#FF47FF",
  places: "#E1F44B",
  organizers: "#6361DD",
  trips: "#930CFF",
}

export type Service = {
  id: "events" | "places" | "organizers" | "trips";
  name: "События" | "Места" | "Организаторы" | "Путешествия";
  illustration: "events" | "places" | "organizers" | "trips";
  description: string;
}
