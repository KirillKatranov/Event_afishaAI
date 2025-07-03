import React from "react";
import {View} from "react-native";
import {Route} from "@/features/routes";

interface CatalogRouteCardProps {
  route: Route;
}

export const CatalogRouteCard: React.FC<CatalogRouteCardProps> = ({
  route
}) => {
  return (
    <View>
      {route.id + " " + route.name}
    </View>
  )
}
