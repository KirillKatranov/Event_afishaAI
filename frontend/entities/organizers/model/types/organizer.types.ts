export type Organizer = {
  id: number,
  name: string,
  phone: string,
  email: string,
  created: string,
  updated: string,
  image: string,
  user: {
    id: number,
    username: string,
    city: string
  }
}
