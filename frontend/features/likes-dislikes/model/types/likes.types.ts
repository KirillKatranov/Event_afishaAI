import {Event} from "@/entities/event"

export type ReactionsParams = {
  username: string;
  date_start?: string;
  date_end?: string;
  value?: "False";
}

export type LikesResponse = {
  status: number;
  data: Event[];
}
