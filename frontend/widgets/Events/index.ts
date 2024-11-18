import {EventsService} from "@/widgets/Events/api/EventsService";

export { EventsSwiper } from "./ui/EventsSwiper"

export {useEventsStore} from "./model/store/useEventsStore"

export {ContentParams, EventsResponse, Event, Contact} from "./model/types/events.types";
export {ActionData, ActionResponseData, ActionResponse} from "./model/types/useraction.types";

export const eventsService = new EventsService();
