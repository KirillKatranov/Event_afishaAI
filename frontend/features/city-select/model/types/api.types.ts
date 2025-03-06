import {CityID} from "@/features/city-select";

export type CitiesResponse = {
  status: number,
  data: {
    cities: CityID[]
  }
}

export type SaveCityRequest = {
  username: string,
  city: CityID
}
