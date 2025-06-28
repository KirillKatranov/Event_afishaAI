import {Tag} from "@/entities/tag";

export type AvailableTagsResponse = {
  status: number;
  data: {
    tags: Tag[],
    preferences: number[]
  }
}

export type AvailableCitiesResponse = {
  status: number;
  data: {
    cities: string[],
  }
}

export type CreateEventRequest = {
  name: string,
  description: string,
  contact?: { contactName: string; contactValue: string; }[]
  date_start?: string,
  date_end?: string,
  time?: string,
  location?: string,
  cost?: number,
  city?: string,
  event_type?: 'online' | 'offline',
  tags: string,
  publisher_type: "organisation" | "user",
  organisation_id?: number,
  image?: File,
}
