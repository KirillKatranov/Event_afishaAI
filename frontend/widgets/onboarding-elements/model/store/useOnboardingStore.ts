import { create } from 'zustand';

interface OnboardingState {
  page: number;
  pageTitle: string;
  pageSubtitle: string;
  incPage: () => void;
  setPageText: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set,get) => ({
  page: 1,
  pageTitle: "ХОЧЕШЬ ЗДОРОВО ПРОВЕСТИ ВРЕМЯ?",
  pageSubtitle: "Выберите нужный город и наслаждайтесь интересными событиями!",

  incPage: () => set({ page: Math.min(3, get().page + 1) }),

  setPageText: () => {
    switch (get().page) {
      case 1: {
        set({
          pageTitle: "ХОЧЕШЬ ЗДОРОВО ПРОВЕСТИ ВРЕМЯ?",
          pageSubtitle: "Выберите нужный город и наслаждайтесь интересными событиями!"
        })
        break;
      }
      case 2: {
        set({
          pageTitle: "МЫ ПОДБЕРЕМ ТО, ЧТО ПО ДУШЕ",
          pageSubtitle: "Вы выбирайте свои интересы – мы попадаем вам в сердечко, все просто!"
        })
        break;
      }
      case 3: {
        set({
          pageTitle: "СОХРАНЯЙ СОБЫТИЕ В КАЛЕНДАРЬ",
          pageSubtitle: "А мы напомним тебе, чтобы ничего не пропустить"
        })
        break;
      }
    }
  }
}));
