import {LikesService} from "@/widgets/Likes/api/LikesService";

export {LikesList} from "./ui/LikesList";

export {useLikesStore} from "./model/store/useLikesStore";
export {LikesParams} from "./model/types/likes.types"

export const likesServices = new LikesService();
