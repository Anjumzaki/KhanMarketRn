import React from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
    };
  }
  componentDidMount() {
    Geolocation.getCurrentPosition(
      (info) => {
        this.setState({ location: info }, alert(JSON.stringify(info)));
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
  }
  render() {
    if (this.state.location) {
      loc = (
        <View style={styles.container}>

          <MapView
          style={styles.map}
            initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            }}
          >
            <Marker
              coordinate={{
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude,
              }}
              title={"title"}
              description={"description"}
            />
          </MapView>
         
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                width:'100%'
              }}
            >
              <TouchableOpacity 
                onPress={() => this.props.navigation.push("App")}
                style={[btnStyles.basic, { width: "80%", marginBottom: 100 }]}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="white"
                  text={"Done"}
                />
              </TouchableOpacity>
            </View>
        </View>

      );
    } else {
      loc = <Text>Loading</Text>;
    }

    return loc;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 50,
  },
});
