import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type EventFormat = 'online' | 'offline';
type TicketType = 'free' | 'paid';

interface EventFormState {
  title: string;
  description: string;
  coverImage: string | null;
  format: EventFormat;
  city: string;
  address: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  isRecurring: boolean;
  recurrencePattern: string;
  category: string;
  ticketType: TicketType;
  priceStart: string;
  priceEnd: string;
  ticketsAmount: string;
  discount: string;
  ageRestriction: string;
}

interface EventFormActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCoverImage: (image: string | null) => void;
  setFormat: (format: EventFormat) => void;
  setCity: (city: string) => void;
  setAddress: (address: string) => void;
  setDateStart: (dateStart: Date) => void;
  setDateEnd: (dateEnd: Date) => void;
  toggleRecurring: () => void;
  setRecurrencePattern: (pattern: string) => void;
  setCategory: (category: string) => void;
  setTicketType: (type: TicketType) => void;
  setPriceStart: (priceStart: string) => void;
  setPriceEnd: (priceEnd: string) => void;
  setTicketsAmount: (ticketsAmount: string) => void;
  setDiscount: (discount: string) => void;
  setAgeRestriction: (restriction: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

const initialState: EventFormState = {
  title: '',
  description: '',
  coverImage: null,
  format: 'online',
  city: '',
  address: '',
  dateStart: null, dateEnd: null,
  isRecurring: false,
  recurrencePattern: '',
  category: '',
  ticketType: 'free',
  priceStart: '', priceEnd: '',
  ticketsAmount: '',
  discount: '',
  ageRestriction: '',
};

export const useEventFormStore = create<EventFormState & EventFormActions>()(
  immer((set, get) => ({
    ...initialState,

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setCoverImage: (coverImage) => set({ coverImage }),

    setFormat: (format) => set({ format }),

    setCity: (city) => set({ city }),
    setAddress: (address) => set({ address }),
    setDateStart: (dateStart) => {
      console.log(dateStart);
      set({dateStart})
    },
    setDateEnd: (dateEnd) => set({ dateEnd }),

    toggleRecurring: () => set((state) => ({ isRecurring: !state.isRecurring })),
    setRecurrencePattern: (recurrencePattern) => set({ recurrencePattern }),

    setCategory: (category) => set({ category }),

    setTicketType: (ticketType) => set({ ticketType }),
    setPriceStart: (priceStart) => set({ priceStart }),
    setPriceEnd: (priceEnd) => set({ priceEnd }),
    setTicketsAmount: (ticketsAmount) => set({ ticketsAmount }),
    setDiscount: (discount) => set({ discount }),
    setAgeRestriction: (ageRestriction) => set({ ageRestriction }),

    resetForm: () => set(initialState),

    submitForm: async () => {
      const formData = get();
      console.log('Submitting form:', formData);
      // Здесь будет логика отправки на сервер
      // await api.createEvent(formData);
    },
  }))
);
