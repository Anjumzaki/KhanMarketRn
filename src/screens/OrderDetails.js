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
  Alert,
  AsyncStorage,
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import QRCode from "react-native-qrcode-generator";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import timestamp from "time-stamp";
import { disableExpoCliLogging } from "expo/build/logs/Logs";

class OrderDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      showNum: false,
      step: 0,
      image: "",
      bd: false,
    };
  }

  async componentDidMount() {
    // this.props.route.params.storeId
    // /v1/storeTimings/:id
    axios
      .post(
        "https://secret-cove-59835.herokuapp.com/v1/store/" +
        this.props.route.params.order.storeID,
        { a: "sd" },
        {
          headers: {
            authorization: this.props.route.params.token,
          },
        }
      )
      .then((resp) =>
        this.setState(
          {
            store: resp.data.result[0],
          },
          console.log(resp.data.result[0])
        )
      )
      .catch((err) => console.log(err));

    const ref = firebase
      .storage()
      .ref("/store_logos/" + this.props.route.params.order.storeID + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));
    // alert(JSON.stringify(this.props.route.params.order));
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

  dateConvert(date1) {
    var date = date1.split("-");
    var month_names = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      "" + month_names[parseInt(date[1] - 1)] + " " + date[0] + ", " + date[2]
    );
  }
  // var token = await AsyncStorage.getItem("token");
  // // this.props.route.params.storeId
  // // /v1/storeTimings/:id
  // axios
  //   .post(
  //     "https://secret-cove-59835.herokuapp.com/v1/store/" +
  //       this.props.route.params.storeId,
  //     { a: "sd" },
  //     {
  //       headers: {
  //         authorization: token,
  //       },
  //     }
  //   )
  //   .then((resp) =>
  //     this.setState({
  //       store: resp.data.result[0],
  //     })
  //   )
  //   .catch((err) => console.log(err));

  makeCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${
        this.state.store ? this.state.store.storeContact : ""
        }`;
    } else {
      phoneNumber = `telprompt:${
        this.state.store ? this.state.store.storeContact : ""
        }`;
    }

    Linking.openURL(phoneNumber);
  };

  tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  render() {
    if (this.props.cart.length > 0) {
      var sId = this.props.cart[0].product.storeId;
    } else {
      var sId = "123";
    }

    var subTotal = 0;

    for (var i = 0; i < this.props.cart.length; i++) {
      var temp = this.props.cart[i].price;
      subTotal = subTotal + parseFloat(temp);
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white", paddingBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text={
                "Order# " +
                this.props.route.params.order.orderNumber.toUpperCase()
              }
            ></LatoText>
            {this.state.showNum ? (
              <TouchableOpacity
                onPress={() => this.setState({ showNum: false })}
                style={{ flexDirection: "row", alignItems: "flex-end" }}
              >
                <MaterialCommunityIcons
                  style={{ marginRight: 5 }}
                  name="chevron-up"
                  color="#2E2E2E"
                  size={20}
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={20}
                  col="#2E2E2E"
                  text="Less"
                ></LatoText>
              </TouchableOpacity>
            ) : (
                <TouchableOpacity
                  onPress={() => this.setState({ showNum: true })}
                  style={{ flexDirection: "row", alignItems: "flex-end" }}
                >
                  <MaterialCommunityIcons
                    style={{ marginRight: 5 }}
                    name="chevron-down"
                    color="#2E2E2E"
                    size={20}
                  />
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={20}
                    col="#2E2E2E"
                    text="Expand"
                  ></LatoText>
                </TouchableOpacity>
              )}
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 0,
              paddingTop: 0,
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 44, height: 44, marginRight: 10 }}
              source={{ uri: this.state.image }}
            />
            <View>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text={this.props.route.params.order.storeName}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingLeft: 70,
              justifyContent: "space-between",
            }}
          >
            <LatoText fontName="Lato-Regular" fonSiz={17} col="#2E2E2E" />
          </View>
          {this.state.showNum && (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingLeft: 70,
                justifyContent: "space-between",
                paddingTop: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={"#2E2E2E"}
                  style={{ paddingRight: 10 }}
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#2E2E2E"
                  text={this.state.store ? this.state.store.storeContact : ""}
                />
              </View>

              <TouchableOpacity onPress={this.makeCall}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#B50000"
                  text={"Call"}
                />
              </TouchableOpacity>
            </View>
          )}
          {!(!this.props.route.params.order.someOneElsePhone) && (
            <>
              <View style={lines.simple} />
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  paddingTop: 30,
                  paddingBottom: 20,
                  alignItems: "center",
                }}
              >
                <LatoText
                  fontName="Lato-Bold"
                  fonSiz={20}
                  col="#2E2E2E"
                  text="Someone else is picking your order"
                ></LatoText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                      style={{ paddingRight: 10 }}
                      name="user"
                      size={15}
                      color="black"
                    />
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#2E2E2E"
                      text={
                        this.props.route.params.order.someOneElseFirstName +
                        " " +
                        this.props.route.params.order.someOneElseLastName
                      }
                    ></LatoText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                      style={{ paddingRight: 10 }}
                      name="mail"
                      size={15}
                      color="black"
                    />
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#2E2E2E"
                      text={this.props.route.params.order.someOneElseEmail}
                    ></LatoText>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,

              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Order was placed at"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  style={{ paddingRight: 10 }}
                  name="calendar"
                  size={15}
                  color="black"
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#2E2E2E"
                  text={this.dateConvert(
                    this.props.route.params.order.orderDate
                  )}
                ></LatoText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  style={{ paddingRight: 10 }}
                  name="clockcircleo"
                  size={15}
                  color="black"
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#2E2E2E"
                  text={this.props.route.params.order.orderTime}
                ></LatoText>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,

              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Order should be ready till"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  style={{ paddingRight: 10 }}
                  name="calendar"
                  size={15}
                  color="black"
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#2E2E2E"
                  text={
                    this.props.route.params.order.pickupDate
                      ? this.dateConvert(
                        this.props.route.params.order.pickupDate
                      )
                      : ""
                  }
                ></LatoText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  style={{ paddingRight: 10 }}
                  name="clockcircleo"
                  size={15}
                  color="black"
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#2E2E2E"
                  text={
                    this.props.route.params.order.pickupTime
                      ? "    " +
                      this.tConvert(this.props.route.params.order.pickupTime)
                      : ""
                  }
                ></LatoText>
              </View>
            </View>
          </View>

          <View style={lines.simple} />
          <View style={{ marginHorizontal: 30, marginVertical: 10 }}>
            {this.props.route.params.order.statusCode === 0 && (
              <Image
                style={{ width: "100%" }}
                resizeMode="contain"
                source={require("../../assets/order1.png")}
              />
            )}
            {this.props.route.params.order.statusCode === 1 && (
              <Image
                style={{ width: "100%" }}
                resizeMode="contain"
                source={require("../../assets/order2.png")}
              />
            )}
            {this.props.route.params.order.statusCode === 2 && (
              <Image
                style={{ width: "100%" }}
                resizeMode="contain"
                source={require("../../assets/order3.png")}
              />
            )}
            {this.props.route.params.order.statusCode === 3 && (
              <Image
                style={{ width: "100%" }}
                resizeMode="contain"
                source={require("../../assets/order4.png")}
              />
            )}
          </View>
          <View style={lines.simple} />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <View style={{ paddingBottom: 20 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#2E2E2E"
                text=" Use the below QR code while recieving the order "
              ></LatoText>
            </View>

            <QRCode
              value={this.props.route.params.order.orderNumber}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#5C5C5C"
              text="Items In Cart"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
            }}
          >
            {this.props.route.params.order.products.map((item, ind) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <View style={{ width: "55%" }}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#2E2E2E"
                    text={item.productName}
                  />
                </View>
                <View
                  style={{
                    width: "45%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={15}
                    col="#2E2E2E"
                    text={
                      "$" +
                      parseFloat(
                        item.productPrice -
                        (item.productPrice * item.productDiscount) / 100
                      ).toFixed(2) +
                      " x " +
                      item.itemQuantity
                    }
                  />

                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={15}
                    col="#2E2E2E"
                    text={
                      "$" +
                      item.itemQuantity *
                      parseFloat(
                        item.productPrice -
                        (item.productPrice * item.productDiscount) / 100
                      ).toFixed(2)
                    }
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={18}
              col="#2E2E2E"
              text={"Sub Total"}
            />
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={18}
              col="#2E2E2E"
              text={
                "$" +
                parseFloat(this.props.route.params.order.totalAmount).toFixed(2)
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={18}
              col="#2E2E2E"
              text={"Tax"}
            />
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={18}
              col="#2E2E2E"
              text={
                "$" + parseFloat(this.props.route.params.order.tax).toFixed(2)
              }
            />
          </View>
          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={25}
              col="#2E2E2E"
              text={"Total"}
            />
            <LatoText
              fontName="Sarabun-Medium"
              fonSiz={18}
              col="#2E2E2E"
              text={
                "$" +
                (
                  parseFloat(this.props.route.params.order.totalAmount) +
                  parseFloat(this.props.route.params.order.tax)
                ).toFixed(2)
              }
            />
          </View>
          <View style={lines.simple} />
          {this.props.route.params.order.statusCode < 2 && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 20,
                paddingTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                if (this.props.route.params.order.statusCode == 0) {
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
                              this.props.route.params.order.orderID +
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
                              this.props.navigation.goBack();
                              this.props.getData();
                            })
                            .catch((err) => console.log(err));
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                } else {
                  alert("Order cannot be cancelled after preperation state.");
                }
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={17}
                col={"#2E2E2E"}
                text="Cancel Order"
              />
            </TouchableOpacity>
          )}
          {this.props.route.params.order.statusCode < 2 && (
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
                text="(Only possible before the order is 'being prepared')"
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
