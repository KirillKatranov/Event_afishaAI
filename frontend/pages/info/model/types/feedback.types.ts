/**
 * Structure of feedback data
 */
export type FeedbackData = {
  username: string;
  message: string;
}

/**
 * Type of POST feedback response
 */
export type FeedbackResponse = {
  status: number;
  data: { status: string };
};
