/**
 * Structure of info about event
 */
export type Event = {
  id: number;
  name: string;
  description: string;
  image: string;
  contact: Contact[] | null;
  date: string;
}

export type Contact = {
  [key: string]: string;
}

/**
 * Structure of params to get events
 */
export type ContentParams = {
  tag?: string,
  date_start?: string,
  date_end?: string
}

/**
 * Type of GET events response
 */
export type EventsResponse = {
  status: number;
  data: Event[];
};
