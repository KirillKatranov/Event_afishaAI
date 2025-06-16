import {Event} from "@/entities/event";
import {Organizer} from "@/entities/organizers";

export type OrganizationEventsResponse = {
  status: number,
  data: {
    organization: Organizer,
    contents: Event[],
    total_count: number
  }
}

export type UserEventsResponse = {
  status: number,
  data: Event[]
}
