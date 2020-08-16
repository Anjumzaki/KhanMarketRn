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
  BackHandler,
  Alert,
} from "react-native";
import StoreCard from "../Components/StoreCard";
import AsyncStorage from "@react-native-community/async-storage";
import { CommonActions } from "@react-navigation/native";
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
      // jsonValue != null ? alert(jsonValue) : null;
    } catch (e) {}
  };
  backAction = () => {
    if (this.props.route.name == "Home") {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    } else {
      return false;
    }
  };
  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    // alert(JSON.stringify(this.props.user));
    console.log(token, "asdas");
    axios
      .get("https://secret-cove-59835.herokuapp.com/v1/store/status/1", {
        headers: {
          authorization: token,
        },
      })
      .then((resp) => {
        this.setState(
          {
            stores: resp.data.result,
          },
          console.log("stores", this.state.stores)
        );
      })
      .catch((err) => console.log(err.message));
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this._unsubscribe = this.props.navigation.addListener("blur", () => {
      this.backHandler.remove();
    });
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
      // alert(this.props.user.user.token);
      // alert(this.props.userLocation.lat);
      // alert(this.props.userLocation.lng);
      axios
        .get("https://secret-cove-59835.herokuapp.com/v1/store/status/1", {
          headers: {
            authorization: token,
          },
        })
        .then((resp) => {
          this.setState(
            {
              stores: resp.data.result,
            },
            console.log("stores", this.state.stores)
          );
        });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
    this.backHandler.remove();
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 3958.8; // Radius of the earth in km
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

  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var radlon1 = (Math.PI * lon1) / 180;
    var radlon2 = (Math.PI * lon2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
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
            {console.log(this.state.stores)}
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
              {this.state.stores.length > 0 &&
                this.state.stores.map((item, ind) => (
                  <StoreCard
                    key={ind}
                    navigation={this.props.navigation}
                    name={item.storeName ? item.storeName : "Error Handled"}
                    distance={
                      // "dummy"
                      this.getDistanceFromLatLonInKm(
                        this.props.userLocation.lat,
                        this.props.userLocation.lng,
                        item.lat,
                        item.lng
                      ).toFixed(2) + " mi"
                    }
                    address={item.address1 + " " + item.state + " " + item.city}
                    id={item.storeID}
                    phone={item.zipCode}
                    sId={item.storeID}
                    oId={item.storeID}
                    storeTax={item.storeTax}
                    token={this}
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
  userLocation: state.Location.locationData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
