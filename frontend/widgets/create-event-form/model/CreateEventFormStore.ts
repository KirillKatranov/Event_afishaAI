import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import CreateEventService from "@/widgets/create-event-form/api/CreateEventService";
import {cities, CityID} from "@/features/city-select";

type EventFormat = 'online' | 'offline';
type TicketType = 'free' | 'paid';

type Contact = {
  contactName: string;
  contactValue: string;
}

interface EventFormState {
  title: string;
  description: string;
  contact: Contact[];
  coverImage: File | undefined;
  format: EventFormat;
  city: string;
  address: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  time: string;
  category: string[];
  ticketType: TicketType;
  priceStart: string;
  priceEnd: string;
  publisherType: "organisation" | "user";
  organisation_id: string | undefined;

  errorMessage?: string;
  isFormValid: boolean;

  categoryOptions: { label: string, value: string }[];
  citiesOptions: { label: string, value: string }[];
}

interface EventFormActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
  updateContact: (index: number, field: keyof Contact, value: string) => void;
  setCoverImage: (image: File | undefined) => void;
  setFormat: (format: EventFormat) => void;
  setCity: (city: string) => void;
  setAddress: (address: string) => void;
  setDateStart: (dateStart: Date) => void;
  setDateEnd: (dateEnd: Date) => void;
  setTime: (time: string) => void;
  setCategory: (category: string[]) => void;
  setTicketType: (type: TicketType) => void;
  setPriceStart: (priceStart: string) => void;
  setPriceEnd: (priceEnd: string) => void;
  setPublisherType: (publisherType: "organisation" | "user") => void;
  setOrganizerId: (organizerId: string) => void;
  resetForm: () => void;
  checkFormValid: () => void;
  submitForm: (username: string, onSuccess?: () => void) => void;

  getAvailableTags: (username: string) => void;
  getAvailableCities: () => void;
}

const initialState: EventFormState = {
  title: '',
  description: '',
  contact: [],
  coverImage: undefined,
  format: 'online',
  city: '',
  address: '',
  dateStart: null, dateEnd: null,
  time: '',
  category: [],
  categoryOptions: [],
  citiesOptions: [],
  ticketType: 'free',
  priceStart: '', priceEnd: '',
  publisherType: "user",
  organisation_id: undefined,
  isFormValid: false,
}

export const useEventFormStore = create<EventFormState & EventFormActions>()(
  immer((set, get) => ({
    ...initialState,

    checkFormValid: () => {
      const state = get();
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      set({ isFormValid: state.title !== "" && state.description != "" && state.category.length > 0 &&
          (state.time === "" || (state.time !== "" && timeRegex.test(state.time)))})
    },

    setTitle: (title) => { set({title}); get().checkFormValid(); },
    setDescription: (description) => { set({description}); get().checkFormValid(); },
    addContact: () =>
      set(state => {
        state.contact.push({ contactName: '', contactValue: '' });
      }),

    removeContact: (index) =>
      set(state => {
        state.contact.splice(index, 1);
      }),

    updateContact: (index, field, value) =>
      set(state => {
        state.contact[index][field] = value;
      }),

    setCoverImage: (coverImage) => set({ coverImage }),

    setFormat: (format) => set({ format }),

    setCity: (city) => set({ city }),
    setAddress: (address) => set({ address }),
    setDateStart: (dateStart) => {set({dateStart})},
    setDateEnd: (dateEnd) => set({ dateEnd }),
    setTime: (time) => set({ time }),

    setCategory: (category) => set({ category }),

    setTicketType: (ticketType) => set({ ticketType }),
    setPriceStart: (priceStart) => set({ priceStart }),
    setPriceEnd: (priceEnd) => set({ priceEnd }),

    setPublisherType: (publisherType) => {
      if (publisherType == "organisation") set({ publisherType })
      else set({ publisherType, organisation_id: undefined })
    },
    setOrganizerId: (organisation_id) => set({ organisation_id }),

    resetForm: () => set(initialState),

    submitForm: (username: string, onSuccess) => {
      set({ errorMessage: undefined })
      const formData = get();

      CreateEventService.createEvent({
        username,
        data: {
          name: formData.title,
          description: formData.description,
          contact: formData.contact,
          date_start: formData.dateStart ? formData.dateStart.toISOString().split("T")[0] : undefined,
          date_end: formData.dateEnd ? formData.dateEnd.toISOString().split("T")[0] : undefined,
          time: formData.time !== '' ? formData.time : undefined,
          location: formData.address !== '' ? formData.address : undefined,
          cost: formData.ticketType == "free" ? 0 : (!isNaN(Number(formData.priceStart)) ? Number(formData.priceStart) : 0),
          city: formData.city !== '' ? formData.city : undefined,
          event_type: formData.format,
          tags: formData.category.join(","),
          publisher_type: formData.publisherType,
          organisation_id: formData.organisation_id ? Number(formData.organisation_id) : undefined,
          image: formData.coverImage
        }})
        .then((response) => {
          if (response && response.error) {
            set({ errorMessage: response.error })
          } else {
            if (onSuccess) onSuccess();
            get().resetForm()
          }
        })
        .catch(e => set({ errorMessage: e.message }))
    },

    getAvailableTags: (username) => {
      CreateEventService.getAvailableTags({ username: username })
        .then((response) => {
          if (response && response.data) {
            const tags = response.data.tags.map((tag) => ({ label: tag.name, value: tag.id.toString() }))
            set({ categoryOptions: tags })
          }
        })
    },

    getAvailableCities: () => {
      CreateEventService.getAvailableCities()
        .then((response) => {
          if (response && response.data) {
            const availableCities = response.data.cities.map((city) => ({ label: cities[city as CityID].name, value: city }))
            set({ citiesOptions:  availableCities })
          }
        })
    }
  }))
);
