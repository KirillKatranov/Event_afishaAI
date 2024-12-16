import {Event} from "@/entities/event";

/**
 * Type of GET events response
 */
export type EventsResponse = {
  status: number;
  data: Event[];
};

/**
 * Type of GET single event response
 */
export type EventResponse = {
  status: number;
  data: Event;
};
