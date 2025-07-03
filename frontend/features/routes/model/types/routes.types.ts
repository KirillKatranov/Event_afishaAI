import {Event} from "@/entities/event";
import {Tag} from "@/entities/tag";

export type Route = {
  id: number,
  name: string,
  description: string,
  duration_km: string,
  duration_hours: string,
  map_link: string,
  city: string,
  created: string,
  updated: string,
  places: Event[],
  tags: Tag[],
  photos: [
    {
      "id": 0,
      "image": "string",
      "description": "string",
      "order": 0
    }
  ]
}
