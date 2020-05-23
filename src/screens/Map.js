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
import axios from "axios";
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      lat: "",
      lng: "",
      completeLoc: "",
    };
  }

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
  componentDidMount() {
    var lat = "";
    var lng = "";
    var newInfo = ''
    Geolocation.getCurrentPosition(
      (info) => {
        lat = info.coords.latitude;
        lng = info.coords.longitude;
        newInfo = info
        this.setState(
          {
            lat,
            lng,
            location: newInfo,
          },
          () => this.getLocationName()
        );
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
    //   console.log("lat longgg", lat1,lng1)
  }
  render() {
    // this.state.completeLoc ? 
    console.log("USer", this.props.user.user._id)
    if(this.state.completeLoc){
      for(var i=0; i<this.state.completeLoc.results[0].address_components.length; i++){
        console.log(this.state.completeLoc.results[0].address_components[i].types[0], this.state.completeLoc.results[0].address_components[i].long_name)
      }
    }
    //  : null

    if (this.state.lat && this.state.lng) {
      loc = (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: Number(this.state.lat),
              longitude: Number(this.state.lng),
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(this.state.lat),
                longitude: Number(this.state.lng),
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
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                axios.delete('https://lit-peak-13067.herokuapp.com/delete/location/'+this.props.user.user._id)
                .then(resp => console.log(resp))
                .catch(err => console.log(err))


                var ad1="",temp="", ad2="",ct="",cnt="",zipc="";
                for(var i=0; i<this.state.completeLoc.results[0].address_components.length; i++){
                    if(this.state.completeLoc.results[0].address_components[i].types[0] === "street_number"){
                      ad1= this.state.completeLoc.results[0].address_components[i].long_name
                    }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "route"){
                      temp= this.state.completeLoc.results[0].address_components[i].long_name
                    }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "locality"){
                      ad2= this.state.completeLoc.results[0].address_components[i].long_name
                    }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "administrative_area_level_1"){
                      ct= this.state.completeLoc.results[0].address_components[i].long_name
                    }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "country"){
                      cnt= this.state.completeLoc.results[0].address_components[i].long_name
                    }else if(this.state.completeLoc.results[0].address_components[i].types[0] === "postal_code"){
                      zipc= this.state.completeLoc.results[0].address_components[i].long_name
                    }
                }
               

                axios
                  .post(
                    "https://lit-peak-13067.herokuapp.com/add/location",
                    {
                      refId: this.props.user.user._id,
                      type: "Customer",
                      address1: ad1 + temp,
                      address2: ad2,
                      city: ct,
                      country: cnt,
                      zipCode: zipc
                    }
                  )
                  .then((resp1) => {
                    this.props.navigation.push("App", {
                      location: this.state.location,
                    });
                  })
                  .catch((err) => console.log(err));
              }}
              // onPress={() => this.props.navigation.push("App")}
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
      loc = <Text style={{ marginTop: 20 }}>Loading</Text>;
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
