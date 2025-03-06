export type CityID = "spb" | "msk" | "ekb" | "nsk" | "nn";

export type City = {
  id: CityID;
  name: string;
  image: string;
}

export const cities = {
  spb: {
    id: "spb",
    name: "Санкт-Петербург",
    image: "https://pic.rutubelist.ru/video/64/20/6420abbd577fc47a399ab82b16e1cb9e.jpg",
  },
  msk: {
    id: "msk",
    name: "Москва",
    image: "https://i.pinimg.com/originals/29/2d/e2/292de231f2d4bb8572813423294bae60.jpg",
  },
  ekb: {
    id: "ekb",
    name: "Екатеринбург",
    image: "https://static.tildacdn.com/tild3366-3136-4532-b133-623664396334/__3.jpg",
  },
  nsk: {
    id: "nsk",
    name: "Новосибирск",
    image: "https://sdelanounas.ru/i/a/w/1/f_aW1nLmdlbGlvcGhvdG8uY29tL25zazIwMTkvMjZfbnNrMjAxOS5qcGc_X19pZD0xMjYwNjM=.jpeg",
  },
  nn: {
    id: "nn",
    name: "Нижний Новгород",
    image: "https://i.pinimg.com/originals/29/16/6d/29166dcfbb40d7199c0f08cb4734a007.jpg",
  }
}
