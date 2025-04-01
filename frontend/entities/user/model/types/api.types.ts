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

export type UserRegisterRequest = {
  username: string;
  city: string;
}

export type UserRegisterResponse = {
  status: number;
  data: {
    meessage: string,
    user_id: number
  }
}


