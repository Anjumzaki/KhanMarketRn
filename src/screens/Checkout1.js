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
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChangeText as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import CodeInput from "react-native-confirmation-code-input";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import {
  btnStyles,
  bottomTab,
  lines,
  conStyles,
  textStyles,
  textIn,
} from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import timestamp from "time-stamp";
import Modal from "react-native-modalbox";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      isOpen: false,
      date: 0,
      times: 0,
      isChecked: false,
      orderDate: "",
      orderTime: "1:00 PM - 2:00 PM",
      storeTimings: {},
      start: "",
      end: "",
      startUnit: "",
      endUnit: "",
      timeArray: [],
      name: "",
      email: "",
      mobile: "",
      num: "",
      tax: "",
      numVerified: false,
      codeMsg: false,
      on: "",
      isDisabled: false,
    };
  }

  componentDidMount() {
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var d = new Date();
    var n = d.getDay();
    this.getTimings(days[n]);

    if (!this.props.user.user.isGuest) {
      this.setState({ numVerified: true });
    }
  }

  getTimings(day) {
    axios
      .get(
        "https://lit-peak-13067.herokuapp.com/get/store/" + this.props.store.id
      )
      .then((resp) => {
        //
        var ishalf = false;
        for (var i = 0; i < resp.data.storeTimings.length; i++) {
          //
          if (resp.data.storeTimings[i].day.substring(0, 3) === day) {
            //
            if (resp.data.storeTimings[i].openTime.includes("30")) {
              ishalf = true;
            }
            var su = "";
            var eu = "";
            if (resp.data.storeTimings[i].openTime.includes("PM")) {
              su = "PM";
            } else {
              su = "AM";
            }
            if (resp.data.storeTimings[i].ClosingTime.includes("PM")) {
              eu = "PM";
            } else {
              eu = "AM";
            }
            //
            var st = resp.data.storeTimings[i].openTime.substring(0, 2);
            var et = resp.data.storeTimings[i].ClosingTime.substring(0, 2);
            if (ishalf) {
              st = parseInt(st) + 1;
            }
            var arr = [];
            var unit = su;
            for (var j = 0; j < 24; j++) {
              if (parseInt(st) === parseInt(et) && unit === eu) {
                break;
              }
              var temp1 = st + ":00 " + unit + " - ";
              st = parseInt(parseInt(st) + 1);

              if (parseInt(st) > 11) {
                if (unit === "PM") {
                  unit = "AM";
                } else {
                  unit = "PM";
                }
              }
              if (parseInt(st) > 12) {
                st = 1;
              }
              // if(parseInt(st) === parseInt(et) && unit === eu) {
              //   break
              // }
              var temp2 = parseInt(st) + ":00 " + unit;
              // st=parseInt(parseInt(st)+1)

              if (parseInt(st) > 11) {
                if (unit === "PM") {
                  unit = "AM";
                } else {
                  unit = "PM";
                }
              }
              if (parseInt(st) > 12) {
                st = 1;
              }
              var temp = temp1 + temp2;
              arr.push(temp);

              if (parseInt(st) === parseInt(et) && unit === eu) {
                break;
              }
            }

            this.setState({
              storeTimings: resp.data.storeTimings[i],
              start: resp.data.storeTimings[i].openTime.substring(0, 2),
              end: resp.data.storeTimings[i].ClosingTime.substring(0, 2),
              startUnit: su,
              endUnit: eu,
              timeArray: arr,
              orderTime: arr[0],
              tax: resp.data.tax,
            });
          }
        }
        //
      })
      .catch((err) => console.log(err));
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }
  onClose() {}

  onOpen() {}

  getDayName(dateStr) {
    //
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var tes = dateStr.replace("-", "/");
    var tes = tes.replace("-", "/");
    var dt = tes.split("/");
    var rt = dt[1] + "/" + dt[0] + "/" + dt[2];
    //
    // // var tes = "05/23/2014";
    //

    return days[new Date(rt).getDay()];
  }

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    axios
      .get("https://lit-peak-13067.herokuapp.com/get/order/bynumber/" + result)
      .then((resp) => {
        if (resp.data === null) {
        } else {
          this.makeid(6);
        }
      })
      .then((err) => console.log(err));

    if (result) {
      return result;
    }

    // ;
  }
  //  ejIEyo
  render() {
    console.log("SD", this.props.user.user);
    var codeId = this.makeid(6);

    //
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
    const daysMap = [1, 2, 3, 4, 5];
    const timeMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var date = new Date();
    var day = date.getDate();
    var month1 = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month1 < 10) {
      month1 = "0" + month1;
    }
    //
    var todaysDate = day + "-" + month1 + "-" + year;
    var dates = [];

    for (var i = -1; i < 12; i++) {
      var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      currentDate.setDate(currentDate.getDate() + i);
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }

      dates.push(day + "-" + month + "-" + year);
    }

    //
    var nameCheck = false;
    if (!this.props.user.user.isGuest) {
      nameCheck = true;
    }

    if (this.state.name || this.props.user.user.name) {
      nameCheck = true;
    }
    //

    var storeProducts = this.props.cart.filter((item, index) => {
      return item.product.storeId === this.props.store.id;
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
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
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Modal
          style={[styles.modal, styles.modal6]}
          position={"center"}
          ref={"modal6"}
          isDisabled={this.state.isDisabled}
        >
          <LatoText
            fontName="Lato-Regular"
            fonSiz={20}
            col="#5C5C5C"
            text={"Please enter the code!"}
          />
          <View style={{ paddingBottom: 10 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={15}
            col="#5C5C5C"
            txtAlign={"center"}
            text={"A 6-digit code has been sent to your number"}
          />
          {this.state.num.length > 0 ? (
            <CodeInput
              ref="codeInputRef2"
              // compareWithCode={this.state.num}
              compareWithCode={this.state.num}
              activeColor="#000000"
              inactiveColor="#000000"
              autoFocus={true}
              ignoreCase={true}
              codeLength={6}
              inputPosition="center"
              size={wp(8)}
              onFulfill={(isValid) =>
                isValid
                  ? this.setState(
                      { codeMsg: false, numVerified: true },
                      this.refs.modal6.close()
                    )
                  : this.setState({ codeMsg: true })
              }
              containerStyle={{ marginTop: 30 }}
              codeInputStyle={{
                borderWidth: 1.5,
                borderRadius: 5,
                borderColor: "#EFEFF4",
                color: "#000000",
              }}
            />
          ) : null}
          {this.state.codeMsg && (
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="red"
              txtAlign={"center"}
              text={"Code is incorect"}
            />
          )}
          <View style={{ paddingBottom: 10 }} />
          <TouchableOpacity onPress={() => this.refs.modal3.close()}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#B50000"
              txtAlign={"center"}
              text={"Cancel"}
            />
          </TouchableOpacity>
        </Modal>

        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          isDisabled={this.state.isDisabled}
        >
          <LatoText
            fontName="Lato-Regular"
            fonSiz={20}
            col="#5C5C5C"
            text={"Pick a date"}
          />
          <View style={{ paddingBottom: 10 }} />
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {dates.map((index, item) => (
                <TouchableOpacity
                  onPress={() => {
                    this.getTimings(this.getDayName(index));
                    this.setState({ date: item, orderDate: dates[item] });
                  }}
                  style={
                    this.state.date == item ? styles.dSelect : styles.dUnSelect
                  }
                >
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={12}
                    col={this.state.date == item ? "white" : "#5C5C5C"}
                    txtAlign={"center"}
                    text={
                      months[parseInt(index.substring(3, 5)) - 1] +
                      " " +
                      index.substring(0, 2)
                    }
                  />
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={10}
                    col={this.state.date == item ? "white" : "#5C5C5C"}
                    txtAlign={"center"}
                    text={this.getDayName(index)}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ width: "100%" }}
          >
            {this.state.timeArray.map((index, item) => (
              <TouchableOpacity
                onPress={() => this.setState({ times: item, orderTime: index })}
                style={
                  this.state.times == item ? styles.tSelect : styles.tUnSelect
                }
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={this.state.times == item ? "white" : "#5C5C5C"}
                  txtAlign={"center"}
                  text={index}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ paddingBottom: 10 }} />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity onPress={() => this.refs.modal3.close()}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                txtAlign={"center"}
                text={"Cancel"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.refs.modal3.close();
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                txtAlign={"center"}
                text={"Save"}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal4"}
          isDisabled={this.state.isDisabled}
        >
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <View style={{ flexGrow: 1 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#5C5C5C"
                text={"Contact Details"}
                txtAlign={"center"}
              />
              <View
                style={{
                  width: "90%",
                  flex: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <View>
                  <View
                    style={[
                      textIn.Flabel,
                      { width: "100%", paddingTop: wp("5%") },
                    ]}
                  >
                    <View>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Enter Name"}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={[textIn.input, { width: "100%" }]}
                        onChangeText={(name) =>
                          this.setState({
                            name,
                          })
                        }
                        value={this.state.name}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={{ marginBottom: 5, marginTop: wp("6%") }}>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Phone Number"}
                      />
                    </View>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Image
                        style={{ width: wp("8%") }}
                        source={require("../../assets/america.png")}
                      />
                      <View
                        style={{
                          width: wp("8%"),
                          justifyContent: "center",
                          alignContent: "center",
                          paddingLeft: 5,
                        }}
                      >
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"+1"}
                        />
                      </View>
                      <TextInput
                        placeholder={"(555) 555-5678"}
                        keyboardType={"numeric"}
                        onChangeText={(mobile) =>
                          this.setState({
                            mobile,
                          })
                        }
                        value={this.state.mobile}
                        style={[textIn.input, { width: "77.5%" }]}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    textIn.Flabel,
                    { width: "100%", paddingTop: wp("5%") },
                  ]}
                >
                  <View>
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#5C5C5C"
                      text={"Enter Email (optional)"}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={[textIn.input, { width: "100%" }]}
                      onChangeText={(email) =>
                        this.setState({
                          email,
                        })
                      }
                      value={this.state.email}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity onPress={() => this.refs.modal4.close()}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#B50000"
                  txtAlign={"center"}
                  text={"Cancel"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.name && this.state.name) {
                    nameCheck = true;
                  }

                  axios
                    .put(
                      "https://lit-peak-13067.herokuapp.com/api/users/guest/edit/" +
                        this.props.user.user._id,
                      {
                        name: this.state.name,
                        email: this.state.email,
                        mobile: this.state.mobile,
                      }
                    )
                    .then((resp) => {
                      this.refs.modal4.close();
                    })
                    .catch((err) => console.log(err));

                  // this.refs.modal4.close()
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#B50000"
                  txtAlign={"center"}
                  text={"Save"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Pickup From"
            ></LatoText>
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
              source={require("../../assets/new.png")}
            />
            <View>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text={this.props.store.name}
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
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={this.props.store.address}
            />
          </View>

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

                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={18}
                col={"#2E2E2E"}
                txtAlign={"center"}
                text={
                  this.state.orderDate
                    ? days[this.state.date]
                    : new Date().toDateString().substring(0, 3)
                }
              />
              <Text>
                  {' '}
              </Text>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col={"#2E2E2E"}
                txtAlign={"center"}
                
                text={
                  this.state.orderDate
                    ? days[this.state.date] +
                      " " +
                      months[
                        parseInt(this.state.orderDate.substring(3, 5)) - 1
                      ] +
                      " " +
                      this.state.orderDate.substring(0, 2) +
                      " " +
                      this.state.orderDate.substring(6, 10)
                    : new Date().toDateString().substring(3, 15)
                }
               
              />
              
              {this.state.storeTimings.isClosed ? (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={"#2E2E2E"}
                  txtAlign={"center"}
                  text={"    Store Closed"}
                />
              ) : (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={"#2E2E2E"}
                  txtAlign={"center"}
                  text={"     " + this.state.orderTime}
                />
              )}
            </View>
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => this.refs.modal3.open()}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={"#2E2E2E"}
              />
            </TouchableOpacity>
          </View>
          <View style={lines.simple} />

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
              col="#2E2E2E"
              text="Contact Details"
            />
            {this.props.user.user.isGuest ? (
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => this.refs.modal4.open()}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={"#2E2E2E"}
                />
              </TouchableOpacity>
            ) : null}
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
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Name"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                this.props.user.user.name
                  ? this.props.user.user.name
                  : this.state.name
              }
            />
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
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Phone Number"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                (this.props.user.user.mobile ? "+" : "") +
                (this.props.user.user.mobile
                  ? this.props.user.user.mobile
                  : this.state.mobile)
              }
            />
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
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Email (optional)"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                this.props.user.user.email
                  ? this.props.user.user.email
                  : this.state.email
              }
            />
          </View>
          <View style={{ alignItems: "flex-end", paddingHorizontal: 20 }}>
            {this.state.numVerified ? (
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2AA034"
                text={"Verified"}
              />
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  // this.props.navigation.navigate("Checkout1")

                  var num = Math.floor(100000 + Math.random() * 900000);
                  await this.setState({ num: num.toString() });
                  this.forceUpdate();
                  var numV;
                  if (this.props.user.user.mobile) {
                    numV = this.props.user.user.mobile;
                  } else {
                    numV = this.state.mobile;
                  }

                  console.log("numv", numV);
                  axios
                    .get(
                      "https://lit-peak-13067.herokuapp.com/api/number/verification/" +
                        "+" +
                        numV +
                        "/" +
                        num
                    )
                    .then((resp) => {
                      console.log(resp);
                      this.refs.modal6.open();
                    })
                    .catch((err) => console.log("sdf", err));
                }}
                style={[btnStyles.cartBtnOutline, { width: "35%" }]}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={18}
                  col="#2E2E2E"
                  text="VERIFY"
                ></LatoText>
              </TouchableOpacity>
            )}
          </View>
          <View style={lines.simple} />
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text="Will someone else be picking your order?"
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            <CheckBox
              style={{ flex: 1 }}
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked,
                });
              }}
              isChecked={this.state.isChecked}
              rightText={"Yes"}
            />
          </View>

          {this.state.isChecked && (
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <View style={{ flexGrow: 1 }}>
                <View
                  style={{
                    width: "100%",
                    flex: 1,
                    justifyContent: "space-evenly",
                    paddingHorizontal: 20,
                  }}
                >
                  <View>
                    <View
                      style={[
                        textIn.Flabel,
                        { width: "100%", paddingTop: wp("5%") },
                      ]}
                    >
                      <View>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"Enter Name"}
                        />
                      </View>
                      <View>
                        <TextInput
                          style={[textIn.input, { width: "100%" }]}
                          onChangeText={(name) =>
                            this.setState({
                              name,
                            })
                          }
                          value={this.state.name}
                        />
                      </View>
                    </View>
                    <View>
                      <View style={{ marginBottom: 5, marginTop: wp("6%") }}>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"Phone Number"}
                        />
                      </View>
                      <View
                        style={{
                          marginBottom: 10,
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Image
                          style={{ width: wp("8%") }}
                          source={require("../../assets/america.png")}
                        />
                        <View
                          style={{
                            width: wp("8%"),
                            justifyContent: "center",
                            alignContent: "center",
                            paddingLeft: 5,
                          }}
                        >
                          <LatoText
                            fontName="Lato-Regular"
                            fonSiz={17}
                            col="#5C5C5C"
                            text={"+1"}
                          />
                        </View>
                        <TextInput
                          placeholder={"(555) 555-5678"}
                          keyboardType={"numeric"}
                          onChangeText={(mobile) =>
                            this.setState({
                              mobile,
                            })
                          }
                          value={this.state.mobile}
                          style={[textIn.input, { width: "81%" }]}
                        />
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      textIn.Flabel,
                      { width: "100%", paddingTop: wp("5%") },
                    ]}
                  >
                    <View>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Enter Email (optional)"}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={[textIn.input, { width: "100%" }]}
                        onChangeText={(email) =>
                          this.setState({
                            email,
                          })
                        }
                        value={this.state.email}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={bottomTab.cartSheet}>
          <TouchableOpacity
            disabled={
              this.state.storeTimings.isClosed ||
              !nameCheck ||
              !this.state.numVerified
            }
            onPress={() => {
              this.setState({ cart: true });
              axios
                .post("https://lit-peak-13067.herokuapp.com/add/order", {
                  storeId: sId,
                  products: storeProducts,
                  totalAmount: subTotal,
                  storeName: this.props.store.name,
                  storeAddress: this.props.store.address,
                  storePhone: this.props.store.phone,
                  userId: this.props.user.user._id,
                  name: this.state.name
                    ? this.state.name
                    : this.props.user.user.name,
                  phone: this.state.mobile
                    ? this.state.mobile
                    : this.props.user.user.mobile,
                  email: this.state.email
                    ? this.state.email
                    : this.props.user.user.email,
                  // address: "bac Street",
                  orderTime: this.state.orderTime,
                  orderDate:
                    this.state.orderDate === ""
                      ? todaysDate
                      : this.state.orderDate,
                  // orderTimeZone: "UST",
                  tax: (parseFloat(this.state.tax) / 100) * subTotal,
                  orderNumber: codeId,
                  isGuest: this.props.user.user.isGuest,
                })
                .then((resp) => {
                  this.props.navigation.navigate("QrCode", {
                    orderId: resp.data.order1._id,
                    codeId: codeId,
                  });
                });
            }}
            style={[btnStyles.cartBtn, { width: "100%" }]}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="CONFIRM"
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
  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998",
  },

  modal3: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width - 50,
  },

  modal4: {
    height: 300,
  },
  modal6: {
    height: 230,
    width: Dimensions.get("window").width - 100,
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },
  dUnSelect: {
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
    marginRight: 10,
  },
  dSelect: {
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
    backgroundColor: "#2E2E2E",
    marginRight: 10,
  },
  tSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    backgroundColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
  tUnSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
