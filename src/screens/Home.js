import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Button,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import StoreCard from "../Components/StoreCard";
import AsyncStorage from "@react-native-community/async-storage";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import fb from "../config/Fire";
import firebase from "firebase";
import StoreHeader from "../Helpers/StoreHeader";
import { bindActionCreators } from "redux";
import { userAsync } from "../store/actions";
import { connect } from "react-redux";
import Geolocation from "@react-native-community/geolocation";
import { getStatusBarHeight } from "react-native-status-bar-height";

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      img: "",
      images: [],
      cards: [],
      image: "",
    };
  }
  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      jsonValue != null ? alert(jsonValue) : null;
    } catch (e) {}
  };
  componentDidMount() {
    Geolocation.getCurrentPosition(
      (info) => {
        axios
          .get(
            "https://sheltered-scrubland-52295.herokuapp.com/get/stores/" +
              info.coords.latitude +
              "/" +
              info.coords.longitude
          )
          .then((resp) => {
            this.setState({
              stores: resp.data,
              location: info.coords,
            });
          });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      Geolocation.getCurrentPosition(
        (info) => {
          axios
            .get(
              "https://sheltered-scrubland-52295.herokuapp.com/get/stores/" +
                info.coords.latitude +
                "/" +
                info.coords.longitude
            )
            .then((resp) => {
              this.setState({
                stores: resp.data,
                location: info.coords,
              });
            });
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // this.deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StoreHeader navigation={this.props.navigation} />
        <StatusBar
          translucent={true}
          barStyle="light-content"
          backgroundColor="transparent"
        />
        {this.state.stores.length > 0 ? (
          <View>
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
              {this.state.stores.length > 0 &&
                this.state.stores.map((item, ind) => (
                  <StoreCard
                    key={ind}
                    key={item._id}
                    navigation={this.props.navigation}
                    name={item.storeName}
                    distance={
                      this.getDistanceFromLatLonInKm(
                        this.state.location.latitude,
                        this.state.location.longitude,
                        item.lat,
                        item.lng
                      ).toFixed(2) + " km"
                    }
                    address={item.storeAddress}
                    id={item._id}
                    phone={item.phoneNumber}
                  />
                ))}
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 200,
            }}
          >
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  loading: state.user.userLoading,
  error: state.user.userError,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
