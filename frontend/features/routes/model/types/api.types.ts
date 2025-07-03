import {Route} from "@/features/routes";

export type RoutesResponse = {
  status: number;
  data: {
    routes: Route[];
    total_count: number;
  }
}
