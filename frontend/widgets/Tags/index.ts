import {TagsService} from "./api/TagsService";

export {TagsList} from "./ui/TagsList";

export {useTagsStore} from "./model/store/useTagsStore";
export {Tag, TagsResponse} from "./model/types/tags.types";

export const tagsService = new TagsService();
