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
import { bindActionCreators } from "redux";
import { locationAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from 'axios'
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      lat: '',
      lng: ''
    }; 
  }
  componentDidMount() {

    var lat1=''
    var lng1=''
    Geolocation.getCurrentPosition(
      (info) => {
        // console.log("ONFFOOO",info.coords.latitude)
        // lat=info.coords.latitude
        // lng=info.coords.longitude

        
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + info.coords.latitude+ ',' + info.coords.longitude + '&key=AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI')
    .then((response) => response.json())
    .then((responseJson) => {
        // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
        // alert(JSON.stringify(responseJson.results[0].formatted_address))
        this.props.locationAsync(JSON.stringify(responseJson.results[0].formatted_address))
     })
     .catch(err => console.log("err", err))

        this.setState({ location: info, lat: info.coords.latitude, lng: info.coords.longitude }, 
          
          // alert(JSON.stringify(info))
          );
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
      console.log("lat longgg", lat1,lng1)


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
              title={"Google"}
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
                onPress={() => this.props.navigation.push("App",{
                  location: this.state.location
                })}
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


const mapStateToProps = (state) => ({
  location: state.Location.locationData
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      locationAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Map);