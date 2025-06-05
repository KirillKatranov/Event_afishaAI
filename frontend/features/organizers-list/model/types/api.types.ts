import {Organizer} from "@/entities/organizers";

export type OrganizersListResponse = {
  status: number,
  data: {
    organisations: Organizer[],
    total_count: number,
  }
}

export type UserOrganizersListResponse = {
  status: number,
  data: {
    organisations: {
      id: number,
      name: string,
      phone: string,
      email: string,
      user_id: number,
      image: string
    },
    total_count: number,
  }
}
