import {Tag} from "@/entities/tag";

/**
 * Type of GET tags response
 */
export type TagsResponse = {
  status: number;
  data: TagsData;
};

export type TagsData = {
  tags: Tag[];
  preferences: number[];
}
