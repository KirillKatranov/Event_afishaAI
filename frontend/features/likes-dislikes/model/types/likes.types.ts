import {Event} from "@/entities/event"

export type LikesParams = {
  username: string;
  date_start?: string;
  date_end?: string;
}

export type LikesResponse = {
  status: number;
  data: Event[];
}
