import {Organizer} from "@/entities/organizers";

export type OrganizersListResponse = {
  status: number,
  data: {
    organisations: Organizer[],
    total_count: number,
  }
}
