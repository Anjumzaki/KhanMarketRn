import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  LinearGradient,
  TouchableOpacity,
  Linking,
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import { filterAsync, searchAsync, userAsync } from "../store/actions";
import { connect } from "react-redux";

import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
const { width } = Dimensions.get("window");
const { height } = 300;

export default class StoreInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      store: "",
      timings: [],
      image: "",
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 0) {
      this.setState({ qt: preNum });
    }
  }

  async componentDidMount() {
    var token = await AsyncStorage.getItem("token");
    // this.props.route.params.storeId
    // /v1/storeTimings/:id
    axios
      .post(
        "https://secret-cove-59835.herokuapp.com/v1/store/" +
          this.props.route.params.storeId,
        { a: "sd" },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((resp) =>
        this.setState({
          store: resp.data.result[0],
        })
      )
      .catch((err) => console.log(err));

    const ref = firebase
      .storage()
      .ref("/store_logos/" + this.props.route.params.storeId + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));
    // /v1/storeTimings/:id
    axios
      .get(
        "https://secret-cove-59835.herokuapp.com/v1/storeTimings/" +
          this.props.route.params.storeId,

        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((resp) => this.setState({ timings: resp.data.result }))
      .catch((err) => console.log(err));
  }

  makeCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${this.state.store.storeContact}`;
    } else {
      phoneNumber = `telprompt:${this.state.store.storeContact}`;
    }

    Linking.openURL(phoneNumber);
  };
  render() {
    alert(JSON.stringify(this.state.store));
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Basic Info"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              paddingTop: 0,
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 44, height: 44, marginRight: 10 }}
              // source={require("../../assets/new.png")}
              source={{ uri: this.state.image }}
            />
            <View>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text={this.state.store.storeName}
              />
            </View>
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              justifyContent: "space-between"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Category: Meat & Vegetables"
            />
          </View> */}

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              alignContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Entypo
              name="location-pin"
              color="#5C5C5C"
              size={17}
              style={{ marginRight: 15 }}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#5C5C5C"
              text={
                this.state.store.address1 +
                " " +
                this.state.store.city +
                " " +
                this.state.store.state +
                " " +
                this.state.store.zipCode
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="phone"
                color="#5C5C5C"
                size={17}
                style={{ marginRight: 15 }}
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#5C5C5C"
                text={this.state.store.storeContact}
              />
            </View>
            <TouchableOpacity onPress={this.makeCall}>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={17}
                col="#5C5C5C"
                text="Call"
              />
            </TouchableOpacity>
          </View>
          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Basic Info"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[6].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[6].isClosed
                  ? "Closed"
                  : this.state.timings[6].openTime +
                    "-" +
                    this.state.timings[6].closeTime)
              }
            />
          </View>
          {/* { this.state.timings.map((item,ind) => { */}
          <View
            // key={ind}
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[0].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[0].isClosed
                  ? "Closed"
                  : this.state.timings[0].openTime +
                    "-" +
                    this.state.timings[0].closeTime)
              }
            />
          </View>
          {/* })}  */}

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[1].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[1].isClosed
                  ? "Closed"
                  : this.state.timings[1].openTime +
                    "-" +
                    this.state.timings[1].closeTime)
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[2].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[2].isClosed
                  ? "Closed"
                  : this.state.timings[2].openTime +
                    "-" +
                    this.state.timings[2].closeTime)
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[3].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[3].isClosed
                  ? "Closed"
                  : this.state.timings[3].openTime +
                    "-" +
                    this.state.timings[3].closeTime)
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[4].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[4].isClosed
                  ? "Closed"
                  : this.state.timings[4].openTime +
                    "-" +
                    this.state.timings[4].closeTime)
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.timings.length > 0 && this.state.timings[5].day}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                this.state.timings.length > 0 &&
                (this.state.timings[5].isClosed
                  ? "Closed"
                  : this.state.timings[5].openTime +
                    "-" +
                    this.state.timings[5].closeTime)
              }
            />
          </View>
          <View style={lines.simple} />
          {this.state.store.messageFromStore ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="Message From Store"
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.messageFromStore ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={this.state.store.messageFromStore}
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.orderCancellationPolicy ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="Order cancelation policy "
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.orderCancellationPolicy ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={this.state.store.orderCancellationPolicy}
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.termsAndConditions ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="Terms & conditions"
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.termsAndConditions ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={this.state.store.termsAndConditions}
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.aboutStore ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="About Store"
              ></LatoText>
            </View>
          ) : null}
          {this.state.store.aboutStore ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={this.state.store.aboutStore}
              ></LatoText>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imgCon: {
    width: Dimensions.get("window").width,
    height: 250,
  },
  topRight: {
    alignSelf: "flex-end",
  },
  wrapTop: {
    alignSelf: "flex-end",

    marginTop: 30,
    backgroundColor: "#7cba80",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  bottomText: {
    height: 200,
    flexDirection: "row",
  },
  buybBtn: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
