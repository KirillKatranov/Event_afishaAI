/**
 * Structure of info about tag
 */
export type Tag = {
  name: string;
  description: string;
  image: string | null;
}

/**
 * Type of GET tags response
 */
export type TagsResponse = {
  status: number;
  data: Tag[];
};
