import React from "react";
import {View} from "react-native";
import {Route} from "@/features/routes";

interface SelectedRouteCardProps {
  route: Route;
}

export const SelectedRouteCard: React.FC<SelectedRouteCardProps> = ({
  route
}) => {
  return (
    <View>
      {route.id + " " + route.name}
    </View>
  )
}
