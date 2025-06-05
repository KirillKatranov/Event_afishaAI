import React from "react";
import {TagsPage} from "@/pages/tags";
import {useLocalSearchParams} from "expo-router";
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
    case "trips":
      return <TripsPage/>
  }
}
