import React from "react";
import {TagsList} from "@/widgets/Tags";
import {Box, Topbar} from "@/shared/ui";

export const TagsPage = () => {
  return (
    <Box
      flex={1}
      flexDirection="column"
    >
      <Topbar title={"Категории"}/>
      <TagsList/>
    </Box>
  )
}
