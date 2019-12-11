import React, { Component, PureComponent } from "react";
import {
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { PlaceMarker } from "../PlaceMarker";
import { mapStyle } from "./mapStyle";

interface Props {
  activity: any;
  ideas: any;
  width: number;
  height: number;
  onPress: Function;
}

export class DayMapView extends Component<Props, any> {
  render() {
    const { activity, width, height, onPress } = this.props;
    console.log("hey");
    const markers = activity.activities.map((a, i) => {
      const latitude = a.idea.displayGeoCode.latitude;
      const longitude = a.idea.displayGeoCode.longitude;
      return {
        label: `${i + 1}`,
        latitude: JSON.parse(latitude),
        longitude: JSON.parse(longitude),
      };
    });
    const initialRegion = markers[0];
    return (
      <View>

      </View>
    );
  }
}
