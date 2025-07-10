import {Event} from "@/entities/event";

export type SearchParams = {
  username: string;
  q?: string;
  city?: string;
  event_type?: "online" | "offline";
  date_from?: string;
  date_to?: string;
  tags?: number[];
  skip?: number;
  limit?: number;
}

export type SearchResponse = {
  status: number,
  data: {
    contents: Event[],
    total_count: number,
    skip: number,
    limit: number,
    has_more: boolean,
    search_params: SearchParams
  }
}

export type SuggestionsResponse = {
  status: number,
  data: {
    suggestions: string[],
    query: string,
  }
}
