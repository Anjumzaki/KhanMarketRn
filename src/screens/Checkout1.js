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
import {
  cartAsync,
  userAsync,
  cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync,
} from "../store/actions";
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
      orderTime: "",
      postDate: "",
      postTime: "",
      storeTimings: {},
      start: "",
      end: "",
      startUnit: "",
      endUnit: "",
      timeArray: [],
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      num: "",
      tax: "",
      numVerified: false,
      codeMsg: false,
      on: "",
      isDisabled: false,
      selectdDay: "",
      isStoreClosed: false,
      sId: "",
      oId: "",
      isOut: false,
      clickCheck: true
    };
  }

  componentDidMount() {
    console.log(
      "ORDERRRRRRRRRRRRRRR numer",
      this.props.user.user
    );

    axios
      .get(
        "https://lit-peak-13067.herokuapp.com/get/store/" + this.props.store.id
      )
      .then((resp) => {
        this.setState({
          sId: resp.data.storeId,
          oId: resp.data.orderNum,
        });
      });

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
            var temp = {};
            if (resp.data.storeTimings[i].isClosed === true) {
              temp = {};
            } else {
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
              temp = resp.data.storeTimings[i];
            }

            if (resp.data.storeTimings[i].isClosed) {
              this.setState({
                storeTimings: "",
                start: "",
                end: "",
                startUnit: "",
                endUnit: "",
                timeArray: ["Store Closed"],
                orderTime: "",
                tax: resp.data.tax,
                isStoreClosed: true,
              });
            } else {
              this.setState({
                storeTimings: resp.data.storeTimings[i],
                start: resp.data.storeTimings[i].openTime.substring(0, 2),
                end: resp.data.storeTimings[i].ClosingTime.substring(0, 2),
                startUnit: su,
                endUnit: eu,
                timeArray: arr,
                orderTime: arr[0],
                tax: resp.data.tax,
                isStoreClosed: false,
              });
            }
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
    // var characters = "0123456789";
    // var charactersLength = characters.length;
    // for (var i = 0; i < length; i++) {
    //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    var fp = this.state.sId;
    if (parseInt(fp) < 10) {
      fp = "00" + fp;
    } else if (parseInt(fp) < 100) {
      fp = "0" + fp;
    }
    var lp = this.state.oId;

    if (parseInt(lp) < 10) {
      lp = "00000" + lp;
    } else if (parseInt(lp) < 100) {
      lp = "0000" + lp;
    } else if (parseInt(lp) < 1000) {
      lp = "000" + lp;
    } else if (parseInt(lp) < 10000) {
      lp = "00" + lp;
    } else if (parseInt(lp) < 100000) {
      lp = "0" + lp;
    }

    result = fp + "-" + lp;
    axios
      .get("https://lit-peak-13067.herokuapp.com/get/order/bynumber/" + result)
      .then((resp) => {
        if (resp.data === null) {
          // /edit/store/orderNum/
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
    console.log("SD", this.state, this.props.user);
    var codeId = this.makeid(3);
    console.log("CODE ID", codeId);
    //      
      // console.log("SDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", new Date("2020-04-30"))

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
    var todaysDate = month1 + "-" + day + "-" + year;
    console.log("sdddddddddddd",todaysDate)
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

    if (this.state.name || this.props.user.user.firstName) {
      nameCheck = true;
    }
    //

    var storeProducts = this.props.cart.filter((item, index) => {
      return item.product.storeId === this.props.store.id;
    });
      console.log("storeProductsstoreProducts",storeProducts)
      var isOut = false
      var pname = ''

      if(this.state.clickCheck){
    for (var i = 0; i < storeProducts.length; i++) {
      if(storeProducts[i].product.isOutOfStock){
        var currentDate= new Date()
        var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          if (day < 10) {
            day = "0" + day;
          }
          if (month < 10) {
            month = "0" + month;
          }

        var todaysDate1 =day + "-" + month + "-" + year;
          console.log(todaysDate1 === storeProducts[i].product.outOfStockDate)
          if(todaysDate1 === storeProducts[i].product.outOfStockDate){
            pname= storeProducts[i].product.productName
             isOut=true
          }
         }
      var temp = storeProducts[i].price;
      // var temp=0
    }
  }
    console.log("iout ois out", isOut)
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
console.log("THIS.STATE",this.state)
    return (
      <>
        <Modal
          style={[styles.modal, styles.modal6]}
          position={"center"}
          ref={"modal6"}
          isDisabled={this.state.isDisabled}
          backdropPressToClose={false}
          swipeToClose={false}
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
              keyboardType={"number-pad"}
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
          <TouchableOpacity onPress={() => this.refs.modal6.close()}>
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
          backdropPressToClose={false}
          swipeToClose={false}
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
                    this.setState({pname: "", isOut: false, clickCheck: false})
                    isOut=false
                    pname= ""
                    this.getTimings(this.getDayName(index));
                    console.log("sdsdadasd213",dates[item])
                    for (var i = 0; i < storeProducts.length; i++) {
                      if(storeProducts[i].product.isOutOfStock){
                        var currentDate= new Date()
                        var day = currentDate.getDate();
                          var month = currentDate.getMonth() + 1;
                          var year = currentDate.getFullYear();
                          if (day < 10) {
                            day = "0" + day;
                          }
                          if (month < 10) {
                            month = "0" + month;
                          }
                
                        var todaysDate1 =day + "-" + month + "-" + year;
                          console.log("aaaaaaaaaaaaaaaa",dates[item] , storeProducts[i].product.outOfStockDate)
                          if(dates[item]  === storeProducts[i].product.outOfStockDate){
                                this.setState({isOut: true, pname: storeProducts[i].product.productName})
                          }
                         }
                        }
                    this.setState({
                      date: item,
                      orderDate: dates[item],
                      selectdDay: this.getDayName(index),
                    });
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
        {/* Wip */}
        <Modal
          style={[styles.modal, styles.modal4]}
          position={"top"}
          ref={"modal4"}
          isDisabled={this.state.isDisabled}
          backdropPressToClose={false}
          swipeToClose={false}
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
                  width: "100%",
                  flex: 1,
                }}
              >
                <View>
                  <View style={textIn.Flabel}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "45%" }}>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"First Name"}
                        />
                        <TextInput
                          style={[textIn.input]}
                          onChangeText={(firstName) =>
                            this.setState({
                              firstName,
                            })
                          }
                          value={this.state.firstName}
                        />
                      </View>
                      <View style={{ width: "45%" }}>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"Last Name"}
                        />
                        <TextInput
                          style={[textIn.input]}
                          onChangeText={(lastName) =>
                            this.setState({
                              lastName,
                            })
                          }
                          value={this.state.lastName}
                        />
                      </View>
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
                onPress={async () => {
                  if (this.state.firstName && this.state.lastName) {
                    nameCheck = true;
                  }

                  var em = this.props.user.user.email;
                  if (this.state.email) {
                    em = this.state.email;
                  }

                  axios
                    .put(
                      "https://lit-peak-13067.herokuapp.com/api/users/guest/edit/" +
                        this.props.user.user._id,
                      {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: em,
                        mobile: "+1" + this.state.mobile,
                      }
                    )
                    .then(async (resp) => {
                      var temp = this.props.user.user;
                      temp.name = this.state.name;
                      temp.email = em;

                      temp.mobile = "+1" + this.state.mobile;

                      var data = {
                        token: this.props.user.token,
                        user: temp,
                      };

                      this.props.userAsync(data);
                      // var myUser = await AsyncStorage.getItem("user");

                      // myUser = JSON.parse(myUser)
                      // myUser.user.firstName = this.state.firstName
                      // myUser.user.lastName = this.state.lastName
                      // myUser.user.mobile = "+1" + this.state.mobile
                      // await AsyncStorage.setItem('user',JSON.stringify(myUser))

                      this.refs.modal4.close();
                    })
                    .catch((err) => console.log(err));

                  this.refs.modal4.close();
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
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
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
                      ? this.state.selectdDay
                      : new Date().toDateString().substring(0, 3)
                  }
                />
                <Text> </Text>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col={"#2E2E2E"}
                  txtAlign={"center"}
                  text={
                    this.state.orderDate
                      ? // days[this.state.date]
                        //  +
                        //   " " +
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

                {this.state.isStoreClosed ? (
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
                  this.props.user.user.firstName
                    ? this.props.user.user.firstName +" "+ this.props.user.user.lastName 
                    : this.state.firstName +" "+ this.state.lastName 
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
                  // (this.props.user.user.mobile ? "+" : "") +
                  this.props.user.user.mobile
                    ? this.props.user.user.mobile
                    : this.state.mobile
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
                      numV = "+1" + this.state.mobile;
                    }
                    // alert(numV)
                    console.log("numv", numV);
                    axios
                      .get(
                        "https://lit-peak-13067.herokuapp.com/api/number/verification/" +
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
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  marginBottom: 100,
                }}
              >
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
                            onChangeText={(firstName) =>
                              this.setState({
                                firstName,
                              })
                            }
                            value={this.state.firstName}
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
                !this.state.numVerified ||
                this.state.isStoreClosed
              }
              onPress={() => {
                console.log("ssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",isOut)
                if(!isOut && !this.state.isOut){
                this.setState({ cart: true });

                var pDate = new Date();
                var dd = String(pDate.getDate()).padStart(2, "0");
                var mm = String(pDate.getMonth() + 1).padStart(2, "0"); //January is 0!
                var yyyy = pDate.getFullYear();

                pDate = dd + "-" + mm + "-" + yyyy;

                var currentdate = new Date();
                var hr =
                  currentdate.getHours() < 10
                    ? "0" + currentdate.getHours()
                    : currentdate.getHours();
                var mi =
                  currentdate.getMinutes() < 10
                    ? "0" + currentdate.getMinutes()
                    : currentdate.getMinutes();
                var sc =
                  currentdate.getSeconds() < 10
                    ? "0" + currentdate.getSeconds()
                    : currentdate.getSeconds();
                var pTime = hr + ":" + mi + ":" + sc;
                var dt = "";
                this.state.orderDate === ""
                  ? (dt = todaysDate)
                  : (dt = this.state.orderDate);
                var timeCheck = true;
                console.log(this.state.orderTime, dt, pTime, pDate);
                if (dt === pDate) {
                  console.log("sdsd");
                  var t1 = pTime.split(":");

                  var t2 = this.state.orderTime.split(":");
                  console.log(parseInt(t1[0]), parseInt(t2[0]));
                  if (parseInt(t1[0]) >= parseInt(t2[0])) {
                    timeCheck = false;
                  }
                }
                if (timeCheck) {
                  axios
                    .post("https://lit-peak-13067.herokuapp.com/add/order", {
                      storeId: sId,
                      products: storeProducts,
                      totalAmount: subTotal,
                      storeName: this.props.store.name,
                      storeAddress: this.props.store.address,
                      storePhone: this.props.store.phone,
                      userId: this.props.user.user._id,
                      name: this.state.firstName
                        ? this.state.firstName +" "+ this.state.lastName
                        : this.props.user.user.firstName +" "+  this.props.user.user.lastName,
                      phone: this.state.mobile
                        ? "+1" + this.state.mobile
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
                      postDate: pDate,
                      postTime: pTime,
                      tax: (parseFloat(this.state.tax) / 100) * subTotal,
                      orderNumber: codeId,
                      isGuest: this.props.user.user.isGuest,
                    })
                    .then((resp) => {
                      // this.props.storeAsync('')
                      // this.props.cartSizeAsync(0)
                      // this.props.storeHeaderAsync('')
                      // this.props.favStoreAsync('')
                      axios
                        .put(
                          "https://lit-peak-13067.herokuapp.com/edit/store/orderNum/" +
                            this.props.store.id +
                            "/" +
                            (parseInt(this.props.store.oId) + 1)
                        )
                        .then((resp1) => {
                          // var temp = this.props.store
                          // temp.oId = parseInt(this.props.store.oId)+1
                          // this.props.storeAsync(temp)
                          // this.props.storeHeaderAsync(temp)
                          this.props.navigation.navigate("QrCode", {
                            orderId: resp.data.order1._id,
                            codeId: codeId,
                            order: resp.data.order1,
                          });
                        })
                        .catch((err) => console.log(err));
                    });
                } else {
                  
                alert(
                    "Store is closed in this date and time, please change date and time."
                  );
                }
              }else{
                console.log("pnamepnamepnamepname",pname)
                  var name = ""
                if(pname){
                  name = pname
                }else{
                  name=this.state.pname
                }
                alert("Sorry, "+name+" Item out of stock for the selected date, change pickup date or remove this product to procceed")
              }
            }}
              style={[
                this.state.storeTimings.isClosed ||
                !nameCheck ||
                !this.state.numVerified ||
                this.state.isStoreClosed
                  ? btnStyles.cartBtn1
                  : btnStyles.cartBtn,
                { width: "100%" },
              ]}
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
      </>
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
    height: 370,
    width: Dimensions.get("window").width - 50,
    marginTop: 30,
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
      userAsync,
      storeAsync,
      cartSizeAsync,
      favStoreAsync,
      storeHeaderAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
