import {create} from "zustand/index";
import {MarkedDates} from "react-native-calendars/src/types";
import {DateData} from "react-native-calendars";
import likesService from "@/features/likes-dislikes/api/LikesService";
import {Event} from "@/entities/event";
import {getDatesInRange} from "@/shared/scripts/date";

interface CalendarState {
  selectedDaysUpdated: boolean;
  tempSelectedDays: MarkedDates;
  selectedDays: MarkedDates;
  likesDays: MarkedDates;
  displayDays: MarkedDates;
  updateSelectedDays: (day: DateData) => void;
  updateLikesDays: (days: Event[]) => void;
  updateDisplayDays: () => void;
  submitSelectedDays: () => void;
  clearSelectedDays: () => void;
  fetchAllLikes: (username: string) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  selectedDaysUpdated: false,
  tempSelectedDays: {},
  selectedDays: {},
  likesDays: {},
  displayDays: {},

  updateSelectedDays: (day: DateData) => {
    set((state) => {
      const newSelectedDays = { ...state.tempSelectedDays };

      if (!newSelectedDays[day.dateString]) {
        newSelectedDays[day.dateString] = { selected: true };
      } else {
        delete newSelectedDays[day.dateString];
      }

      const sortedDates = Object.keys(newSelectedDays)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const updatedSelectedDays: MarkedDates = {};

      if (sortedDates.length > 0) {
        const startingDay = sortedDates[0];
        const endingDay = sortedDates[sortedDates.length - 1];

        const rangeDates = getDatesInRange(startingDay, endingDay);

        rangeDates.forEach((date) => {
          updatedSelectedDays[date] = {
            selected: true,
            color: "#358ffe",
            startingDay: date === startingDay,
            endingDay: date === endingDay,
          };
        });
      }

      console.log("temp selected", updatedSelectedDays);
      return { tempSelectedDays: updatedSelectedDays };
    });

    if (!get().selectedDaysUpdated) set({ selectedDaysUpdated: true });

    get().updateDisplayDays();
  },

  updateLikesDays: (likes) => {
    set(() => {
      const updatedLikesDays: MarkedDates = {};

      likes.forEach((event) => {
        updatedLikesDays[event.date] = { marked: true }
      })

      console.log("liked", updatedLikesDays);
      return { likesDays: updatedLikesDays };
    });

    get().updateDisplayDays();
  },

  fetchAllLikes: (username: string) => {
    likesService.getReactions({username: username})
      .then((response) => get().updateLikesDays(response.data));
  },

  updateDisplayDays: () => {
    set((state) => {
      const updatedDisplayDays = { ...state.tempSelectedDays };

      Object.keys(state.likesDays).forEach((day) => {
        if (updatedDisplayDays[day]) {
          updatedDisplayDays[day].marked = true;
        } else {
          updatedDisplayDays[day] = { marked: true };
        }
        updatedDisplayDays[day].dotColor = "red";
      })

      console.log("display", updatedDisplayDays);
      return { displayDays: updatedDisplayDays };
    });
  },

  submitSelectedDays: () => {
    set((state) => ({ selectedDays: state.tempSelectedDays }));
    set({ selectedDaysUpdated: false });
  },

  clearSelectedDays: () => {
    set({ selectedDays: {}, tempSelectedDays: {}, selectedDaysUpdated: false });

    get().updateDisplayDays();
  }
}));
