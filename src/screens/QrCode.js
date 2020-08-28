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
  Alert,
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import InQrCode from "./InQrCode";
import { bindActionCreators } from "redux";
import {
  cartAsync,
  cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
const { width } = Dimensions.get("window");
const { height } = 300;

class QrCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
    };
  }

  componentDidMount() {
    this.props.cartAsync([]);
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={25}
              col="#5C5C5C"
              text="Thank You"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
              paddingBottom: 30,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text="We have recieved your order. You can check its status in ‘My Orders’ section. We hope you enjoy your purchase from Khan Market!"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#5C5C5C"
              text={
                "Your order number is " +
                this.props.route.params.codeId.toUpperCase()
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              justifyContent: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text="Use the below QR code while recieving the order."
            />
          </View>

          <InQrCode orderId={this.props.route.params.orderId} />
          {/* <Text>{this.props.route.params.orderID}</Text> */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              paddingTop: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            // disabled={this.props.route.params.order.isRejected || this.props.route.params.order.isPicked}
            onPress={() => {
              Alert.alert(
                "Alert!",
                "Are you sure you want to cancel the order?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      axios
                        .put(
                          "https://secret-cove-59835.herokuapp.com/v1/transaction/status/" +
                            this.props.route.params.orderID +
                            "/4",
                          { a: "a" },
                          {
                            headers: {
                              authorization: this.props.route.params.token,
                            },
                          }
                        )
                        .then((resp) => {
                          alert("Order Cancelled Successfully.");
                          // this.props.getData();
                          // alert(JSON.stringify(resp.data));
                          this.props.navigation.navigate("MyOrders");
                        })
                        .catch((err) => alert(JSON.stringify(err)));
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={17}
              col="#2E2E2E"
              text="Cancel Order"
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#2E2E2E"
              text="Terms and conditions apply"
            />
          </View>
        </ScrollView>
        <View style={bottomTab.cartSheet}>
          <TouchableOpacity
            onPress={() => {
              this.props.storeAsync("");
              this.props.cartSizeAsync(0);
              this.props.storeHeaderAsync("");
              this.props.favStoreAsync("");
              this.props.navigation.navigate("Home");
            }}
            style={[btnStyles.cartBtn, { width: "55%" }]}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="KEEP SHOPING"
            ></LatoText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.storeAsync("");
              this.props.cartSizeAsync(0);
              this.props.storeHeaderAsync("");
              this.props.favStoreAsync("");
              this.props.navigation.navigate("MyOrderStackScreen", {
                screen: "MyOrders",
              });
            }}
            style={[btnStyles.cartBtn, { width: "40%" }]}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="MY ORDERS"
            ></LatoText>
          </TouchableOpacity>
        </View>
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

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
      favStoreAsync,
      storeHeaderAsync,
      storeAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QrCode);
