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
  date: string;
  tags?: Tag[];
  time?: string;
  cost?: string;
  location?: string;
}

export type Contact = {
  [key: string]: string;
}
