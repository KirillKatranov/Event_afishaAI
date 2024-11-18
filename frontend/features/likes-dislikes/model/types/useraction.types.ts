/**
 * Type of POST like/dislike response data
 */
export type ActionData = {
  action: "like" | "dislike",
  username: string,
  contentId: number
};

/**
 * Type of POST like/dislike response data
 */
export type ActionResponseData = {
  user: string,
  content: number,
  value: boolean
};

/**
 * Type of POST like/dislike response
 */
export type ActionResponse = {
  status: number;
  data: ActionResponseData;
};
