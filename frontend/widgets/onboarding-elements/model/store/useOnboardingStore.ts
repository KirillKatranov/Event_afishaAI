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
  pageSubtitle: "Выбери, как провести время",

  incPage: () => set({ page: Math.min(4, get().page + 1) }),
  decPage: () => set({ page: Math.max(1, get().page - 1) }),
  setPageText: () => {
    switch (get().page) {
      case 1: {
        set({
          pageSubtitle: "ВЫБЕРИ, КАК\nПРОВЕСТИ ВРЕМЯ"
        })
        break;
      }
      case 2: {
        set({
          pageTitle: "СОХРАНИ МОМЕНТЫ,\nКОТОРЫЕ ЖДУТ ТЕБЯ",
          pageSubtitle: "ПОСЕТИ ИХ ВСЕ!"
        })
        break;
      }
      case 3: {
        set({
          pageTitle: "МЫ ВСЕГДА РЯДОМ,\nЧТОБЫ НАПОМНИТЬ!",
          pageSubtitle: "ВСЕ ДЛЯ ТВОЕГО\nОТПУСКА"
        })
        break;
      }
      case 4: {
        set({
          pageTitle: "МЫ ВСЕГДА РЯДОМ,\nЧТОБЫ НАПОМНИТЬ!",
          pageSubtitle: "ИЩИ ДРУЗЕЙ И СОБИРАЙ\nЕДИНОМЫШЛЕННИКОВ"
        })
        break;
      }
    }
  }
}));
