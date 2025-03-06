export type UserRequest = {
  username: string;
}

export type UserResponse = {
  status: number;
  data: {
    city: string,
    username: string
  }
}

