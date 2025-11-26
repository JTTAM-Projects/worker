import MapView, { Marker } from "react-native-maps";

export default function Map() {
  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      initialRegion={{
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      }}
    >
      <Marker
        coordinate={{
          latitude: 60.201373,
          longitude: 24.934041,
        }}
        title="Haaga-Helia"
      />
    </MapView>
  );
}
