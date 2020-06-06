// import React from "react";
// import MapView, { Marker } from "react-native-maps";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import Geolocation from "@react-native-community/geolocation";
// import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
// import LatoText from "../Helpers/LatoText";
// import { bindActionCreators } from "redux";
// import { locationAsync } from "../store/actions";
// import { connect } from "react-redux";
// import axios from "axios";
// class Map extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       location: "",
//       lat: "",
//       lng: "",
//       completeLoc: "",
//     };
//   }

//   getLocationName = () => {
//     fetch(
//       "https://maps.googleapis.com/maps/api/geocode/json?address=" +
//         this.state.location.coords.latitude +
//         "," +
//         this.state.location.coords.longitude +
//         "&key=AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI"
//     )
//       .then((response) => response.json())
//       .then((responseJson) => {
//         this.setState({ completeLoc: responseJson });
//         this.props.locationAsync(
//           JSON.stringify(responseJson.results[0].formatted_address)
//         );
//       })
//       .catch((err) => console.log("err", err));
//   };
//   componentDidMount() {
//     var lat = "";
//     var lng = "";
//     var newInfo = ''
//     Geolocation.getCurrentPosition(
//       (info) => {
//         lat = info.coords.latitude;
//         lng = info.coords.longitude;
//         newInfo = info
//         this.setState(
//           {
//             lat,
//             lng,
//             location: newInfo,
//           },
//           () => this.getLocationName()
//         );
//       },
//       (error) => {
//         console.log(error);
//       },
//       { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
//     );
//     //   console.log("lat longgg", lat1,lng1)
//   }
//   render() {
//     // this.state.completeLoc ?
//     console.log("USer", this.props.user.user._id)
//     if(this.state.completeLoc){
//       for(var i=0; i<this.state.completeLoc.results[0].address_components.length; i++){
//         console.log(this.state.completeLoc.results[0].address_components[i].types[0], this.state.completeLoc.results[0].address_components[i].long_name)
//       }
//     }
//     //  : null

//     if (this.state.lat && this.state.lng) {
//       loc = (
//         <View style={styles.container}>
//           <MapView
//             style={styles.map}
//             initialRegion={{
//               latitude: Number(this.state.lat),
//               longitude: Number(this.state.lng),
//               latitudeDelta: 0.0,
//               longitudeDelta: 0.0,
//             }}
//           >
//             <Marker
//               coordinate={{
//                 latitude: Number(this.state.lat),
//                 longitude: Number(this.state.lng),
//               }}
//               title={"Google"}
//               description={"description"}
//               draggable
//             />
//           </MapView>

//           <View
//             style={{
//               flex: 1,
//               justifyContent: "flex-end",
//               alignItems: "center",
//               width: "100%",
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => {
//                 axios.delete('https://lit-peak-13067.herokuapp.com/delete/location/'+this.props.user.user._id)
//                 .then(resp => console.log(resp))
//                 .catch(err => console.log(err))

//                 var ad1="",temp="", ad2="",ct="",cnt="",zipc="";
//                 for(var i=0; i<this.state.completeLoc.results[0].address_components.length; i++){
//                     if(this.state.completeLoc.results[0].address_components[i].types[0] === "street_number"){
//                       ad1= this.state.completeLoc.results[0].address_components[i].long_name
//                     }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "route"){
//                       temp= this.state.completeLoc.results[0].address_components[i].long_name
//                     }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "locality"){
//                       ad2= this.state.completeLoc.results[0].address_components[i].long_name
//                     }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "administrative_area_level_1"){
//                       ct= this.state.completeLoc.results[0].address_components[i].long_name
//                     }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "country"){
//                       cnt= this.state.completeLoc.results[0].address_components[i].long_name
//                     }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "postal_code"){
//                       zipc= this.state.completeLoc.results[0].address_components[i].long_name
//                     }
//                 }

//                 axios
//                   .post(
//                     "https://lit-peak-13067.herokuapp.com/add/location",
//                     {
//                       refId: this.props.user.user._id,
//                       type: "Customer",
//                       address1: ad1 + temp,
//                       address2: ad2,
//                       city: ct,
//                       country: cnt,
//                       zipCode: zipc
//                     }
//                   )
//                   .then((resp1) => {
//                     this.props.navigation.replace("App", {
//                       location: this.state.location,
//                     });
//                   })
//                   .catch((err) => console.log(err));
//               }}
//               // onPress={() => this.props.navigation.push("App")}
//               style={[btnStyles.basic, { width: "80%", marginBottom: 100 }]}
//             >
//               <LatoText
//                 fontName="Lato-Regular"
//                 fonSiz={17}
//                 col="white"
//                 text={"Done"}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     } else {
//       loc = <Text style={{ marginTop: 20 }}>Loading</Text>;
//     }

//     return loc;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   map: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   mapStyle: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height + 50,
//   },
// });

// const mapStateToProps = (state) => ({
//   location: state.Location.locationData,
//   user: state.user.user,
// });
// const mapDispatchToProps = (dispatch, ownProps) =>
//   bindActionCreators(
//     {
//       locationAsync,
//     },
//     dispatch
//   );

// export default connect(mapStateToProps, mapDispatchToProps)(Map);

import React, { Component } from "react";

import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  StatusBar,
  Platform,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import LatoText from "../Helpers/LatoText";
import { bindActionCreators } from "redux";
import { locationAsync } from "../store/actions";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
import styles from "./styles";
import axios from "axios";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";
import Geocoder from "react-native-geocoding";
// Disable yellow box warning messages
console.disableYellowBox = true;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      region: {
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      },
      isMapReady: false,
      marginTop: 1,
      userLocation: "",
      regionChangeProgress: false,
      completeLoc: "",
    };
  }

  componentWillMount() {
    Geocoder.init("AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI");
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        };
        this.setState({
          region: region,
          loading: false,
          error: null,
        });
      },
      (error) => {
        alert(error);
        this.setState({
          error: error.message,
          loading: false,
        });
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 }
    );
  }

  onMapReady = () => {
    this.setState({ isMapReady: true, marginTop: 0 });
  };

  // Fetch location details as a JOSN from google map API
  getLocationName = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        this.state.location.coords.latitude +
        "," +
        this.state.location.coords.longitude +
        "&key=AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ completeLoc: responseJson });
        this.props.locationAsync(
          JSON.stringify(responseJson.results[0].formatted_address)
        );
      })
      .catch((err) => console.log("err", err));
  };
  fetchAddress = () => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        this.state.region.latitude +
        "," +
        this.state.region.longitude +
        "&key=" +
        "AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        const userLocation = responseJson.results[0].formatted_address;
        console.log("result", responseJson.results[0].address_components);
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false,
          completeLoc: responseJson,
        });
      });
  };

  // Update state on region change
  onRegionChange = (region) => {
    this.setState(
      {
        region,
        regionChangeProgress: true,
      },
      () => this.fetchAddress()
    );
  };

  // Action to be taken after select location button click
  onLocationSelect = () => alert(this.state.userLocation);

  render() {
    console.log(this.state.completeLoc);
    if (this.state.loading) {
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor="transparent"
            translucent={true}
            barStyle="light-content"
          />

          <View
            style={{
              paddingTop: getStatusBarHeight(),
              backgroundColor: "#2E2E2E",
              position: "absolute",
              top: 0,
              paddingBottom: 20,
              zIndex: 1,
              width: "100%",
            }}
          >
            <GooglePlacesAutocomplete
              styles={{
                powered: {
                  display: "none",
                },
                textInputContainer: {
                  backgroundColor: "rgba(0,0,0,0)",
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  marginHorizontal: 20,
                  fontSize: 20,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: "#5d5d5d",
                  fontSize: 16,
                  color: "black",
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
                listView: {
                  color: "white",
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  marginBottom: -20,
                  marginTop: 20,
                },
                poweredContainer: {
                  display: "none",
                },
              }}
              listUnderlayColor="green"
              placeholder="Search locations here"
              onPress={(data, details = null) => {
                Geocoder.from(data.description)
                  .then((json) => {
                    var location = json.results[0].geometry.location;
                   let region = {
                      latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: 0.007,
                      longitudeDelta: 0.007,
                    }
                    this.setState({
                      region,
                      regionChangeProgress: true,
                    }, () => this.fetchAddress())
                  })
                  .catch((error) => console.warn(error));
               
              }}
              query={{
                key: "AIzaSyCYwrgArmp1NxJsU8LsgVKu5De5uCx57dI",
                language: "en",
              }}
            />
          </View>

          <View style={{ flex: 1, paddingTop: getStatusBarHeight() }}>
            {!!this.state.region.latitude && !!this.state.region.longitude && (
              <MapView
                style={{ ...styles.map, marginTop: this.state.marginTop }}
                region={this.state.region}
                showsUserLocation={true}
                onMapReady={this.onMapReady}
                onRegionChangeComplete={this.onRegionChange}
              ></MapView>
            )}

            <View style={styles.mapMarkerContainer}>
              <Entypo name="location-pin" color="red" size={50} />
            </View>
          </View>
          <View style={styles.deatilSection}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "white",
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={12}
                col="black"
                text={"Move map for location"}
              />
              <View style={{ marginBottom: 10 }} />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={18}
                col="black"
                text={
                  !this.state.regionChangeProgress
                    ? this.state.userLocation
                    : "Identifying Location..."
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                axios
                  .delete(
                    "https://lit-peak-13067.herokuapp.com/delete/location/" +
                      this.props.user.user._id
                  )
                  .then((resp) => console.log(resp))
                  .catch((err) => console.log(err));

                var ad1 = "",
                  temp = "",
                  ad2 = "",
                  ct = "",
                  cnt = "",
                  zipc = "";
                console.log(" ins state", this.state.completeLoc);
                for (
                  var i = 0;
                  i <
                  this.state.completeLoc.results[0].address_components.length;
                  i++
                ) {
                  if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "street_number"
                  ) {
                    ad1 = this.state.completeLoc.results[0].address_components[
                      i
                    ].long_name;
                  } else if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "route"
                  ) {
                    temp = this.state.completeLoc.results[0].address_components[
                      i
                    ].long_name;
                  } else if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "locality"
                  ) {
                    ad2 = this.state.completeLoc.results[0].address_components[
                      i
                    ].long_name;
                  } else if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "administrative_area_level_1"
                  ) {
                    ct = this.state.completeLoc.results[0].address_components[i]
                      .long_name;
                  } else if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "country"
                  ) {
                    cnt = this.state.completeLoc.results[0].address_components[
                      i
                    ].long_name;
                  } else if (
                    this.state.completeLoc.results[0].address_components[i]
                      .types[0] === "postal_code"
                  ) {
                    zipc = this.state.completeLoc.results[0].address_components[
                      i
                    ].long_name;
                  }
                }

                this.props.locationAsync({
                  location: ad1 + " " + temp + " " + ad2 + " " + ct + " " + cnt,
                  lat: this.state.region.latitude,
                  lng: this.state.region.longitude,
                });

                axios
                  .post("https://lit-peak-13067.herokuapp.com/add/location", {
                    refId: this.props.user.user._id,
                    type: "Customer",
                    address1: ad1 + " " + temp,
                    address2: ad2,
                    city: ct,
                    country: cnt,
                    zipCode: zipc,
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                  })
                  .then((resp1) => {
                    this.props.navigation.push("App", {
                      location: this.state.location,
                    });
                  })
                  .catch((err) => console.log(err));
              }}
              // onPress={() => this.props.navigation.push("App")}
              style={[
                btnStyles.basic,
                Platform.OS == "ios"
                  ? { width: "100%", marginBottom: 10, marginTop: 20 }
                  : { width: "100%", marginBottom: 30, marginTop: 20 },
              ]}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="white"
                text={"Done"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  location: state.Location.locationData,
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      locationAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Map);
