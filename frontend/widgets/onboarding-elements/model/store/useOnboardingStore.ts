import { create } from 'zustand';

interface OnboardingState {
  page: number;
  pageTitle: string;
  pageSubtitle: string;
  incPage: () => void;
  decPage: () => void;
  setPageText: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set,get) => ({
  page: 1,
  pageTitle: "",
  pageSubtitle: "Смотри ленту событий, созданную\nспециально",

  incPage: () => set({ page: Math.min(3, get().page + 1) }),
  decPage: () => set({ page: Math.max(1, get().page - 1) }),
  setPageText: () => {
    switch (get().page) {
      case 1: {
        set({
          pageSubtitle: "Смотри ленту событий, созданную\nспециально"
        })
        break;
      }
      case 2: {
        set({
          pageTitle: "СОХРАНИ МОМЕНТЫ,\nКОТОРЫЕ ЖДУТ ТЕБЯ",
          pageSubtitle: "Лайкни понравившееся\nмероприятие — и оно всегда будет у\nтебя "
        })
        break;
      }
      case 3: {
        set({
          pageTitle: "МЫ ВСЕГДА РЯДОМ,\nЧТОБЫ НАПОМНИТЬ!",
          pageSubtitle: "Не переживай о том, что забудешь о\nмероприятии - мы обязательно\nпришлём тебе напоминание!"
        })
        break;
      }
    }
  }
}));
