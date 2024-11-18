import {Event} from "@/entities/event";

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
