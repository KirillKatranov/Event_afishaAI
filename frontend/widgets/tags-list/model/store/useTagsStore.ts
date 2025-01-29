import { create } from 'zustand';
import {Tag} from "@/entities/tag";
import tagsService from "@/widgets/tags-list/api/TagsService";
import {PreferencesRequest, TagsRequest} from "@/widgets/tags-list";
import {useFeedStore} from "@/features/content";
import {getPeriodBorders} from "@/shared/scripts/date";
import {useCalendarStore} from "@/features/dates";

interface TagsState {
  tags: Tag[];
  preferences: number[];
  onTagLike: (params: PreferencesRequest) => void;
  isLoading: boolean;
  hasError: boolean;
  fetchTags: (params: TagsRequest) => void;
}

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  preferences: [],
  isLoading: true,
  hasError: false,

  onTagLike: (params: PreferencesRequest) => {
    const updateFeed = () => {
      const borders = getPeriodBorders(Object.keys(useCalendarStore.getState().selectedDays));
      useFeedStore.getState().fetchFeed({
        username: params.username,
        date_start: borders.date_start,
        date_end: borders.date_end,
      })
    }

    set((state) => {
      let newPreferences: number[];

      if (state.preferences.find((p) => p === params.tag_id)) {
        tagsService.deletePreference(params)
          .then((_response) => updateFeed())
          .catch((e) => console.log(e));

        newPreferences = state.preferences.filter((p) => p !== params.tag_id);
      } else {
        tagsService.savePreference(params)
          .then((_response) => updateFeed())
          .catch((e) => console.log(e));

        newPreferences = [...state.preferences, params.tag_id];
      }

      return { tags: sortTagsByPreferences(state.tags, newPreferences), preferences: newPreferences };
    });
  },

  fetchTags: (params) => {
    set({ isLoading: true, hasError: false });

    tagsService.getTags(params)
      .then((response) => {
        if (response.status == 200) {
          console.log(`Successfully received tags`);
          set({ tags: sortTagsByPreferences(response.data.tags, response.data.preferences), preferences: response.data.preferences, isLoading: false });
        } else {
          console.log(`Tags request error with code: ${response.status}`);
          set({ hasError: true, isLoading: false });
        }
      })
      .catch((e) => {
        console.log(`Events request error: ${e}`);
        set({ hasError: true, isLoading: false });
      });
  }
}));

const sortTagsByPreferences = (tags: Tag[], preferences: number[]): Tag[] => {
  return tags.sort((a, b) => {
    const indexA = preferences.indexOf(a.id);
    const indexB = preferences.indexOf(b.id);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return b.count - a.count;
  });
};
