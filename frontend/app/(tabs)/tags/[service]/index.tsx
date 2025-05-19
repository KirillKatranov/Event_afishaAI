import React from "react";
import {TagsPage} from "@/pages/tags";
import {useLocalSearchParams} from "expo-router";
import {OrganizersPage} from "@/pages/organizers";
import {TripsPage} from "@/pages/trips";

type ServiceParams = {
  service: "events" | "places" | "organizers" | "trips";
};


export default function ServiceScreen() {
  const { service } = useLocalSearchParams<ServiceParams>();

  switch (service) {
    case "events":
    case "places":
      return <TagsPage/>;
    case "organizers":
      return <OrganizersPage/>;
    case "trips":
      return <TripsPage/>
  }
}
