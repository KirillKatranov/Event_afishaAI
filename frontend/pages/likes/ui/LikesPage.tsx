import React from "react";
import {LikesList} from "@/widgets/Likes";
import {Box, Topbar} from "@/shared/ui";

export const LikesPage = () => {
  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
    >
      <Topbar title={"Понравилось"} />
      <LikesList/>
    </Box>
  )
}
