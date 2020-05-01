import React from "react";
import MapView from "react-native-maps";
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
    Geolocation.getCurrentPosition((info) =>
      this.setState({ location: info }, alert(JSON.stringify(info)))
    );
  }
  render() {
    if (this.state.location) {
      loc = (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0,
            longitudeDelta: 0.0,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
            }}
            title={"title"}
            description={"description"}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={()=>this.props.navigation.push('App')} style={[btnStyles.basic,{width:'80%',marginBottom:100}]}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="white"
                text={"Done"}
              />
            </TouchableOpacity>
          </View>
        </MapView>
      );
    } else {
      loc = <Text>Loading</Text>;
    }

    return <View style={styles.container}>{loc}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
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
