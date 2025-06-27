import {User} from "@/entities/user";

export type ParticipantsResponse = {
  status: number;
  data: User[];
}
