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
  event_type?: "online" | "offline";
  publisher_type?: "organisation" | "user";
  publisher_id?: number
}

export type Contact = {
  [key: string]: string;
}
