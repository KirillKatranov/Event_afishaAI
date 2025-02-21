import {Tag} from "@/entities/tag";

/**
 * Structure of info about event
 */
export type Event = {
  id: number;
  name: string;
  description: string;
  image: string;
  contact?: Contact[];
  date_start?: string;
  date_end?: string;
  tags?: Tag[];
  time?: string;
  cost?: string;
  location?: string;
  macro_category?: "events" | "places" | "organizers" | "trips" ;
}

export type Contact = {
  [key: string]: string;
}
