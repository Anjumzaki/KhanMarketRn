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
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
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
import * as EmailValidator from "email-validator";

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
import firebase from "firebase";
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
      storeTimings: [],
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
      clickCheck: true,
      someOneElseFirstName: "",
      someOneElseLastName: "",
      someOneElseEmail: "",
      someOneElsePhone: "",
      previousMobileNumber: "",
      keyState: false,
      minTime: "0",
      image: "",
      storeTimeCLose: true,
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    if (this.props.store) {
      const ref = firebase
        .storage()
        .ref("/store_logos/" + this.props.store.id + ".jpg");
      ref
        .getDownloadURL()
        .then((url) => {
          this.setState({ image: url });
        })
        .catch((err) => console.log(err));
    }
    console.log("ORDERRRRRRRRRRRRRRR numer", this.props.user.user);
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    this.setState({
      firstName: this.props.user.user.firstName
        ? this.props.user.user.firstName
        : "",
      lastName: this.props.user.user.lastName
        ? this.props.user.user.lastName
        : "",
      email: this.props.user.user.email ? this.props.user.user.email : "",
      mobile: this.props.user.user.mobile
        ? this.props.user.user.mobile.substring(
            2,
            this.props.user.user.mobile.length
          )
        : "",
      previousMobileNumber: this.props.user.user.mobile
        ? this.props.user.user.mobile.substring(
            2,
            this.props.user.user.mobile.length
          )
        : "",
    });
    axios
      .get(
        "https://lit-peak-13067.herokuapp.com/get/store/" + this.props.store.id
      )
      .then((resp) => {
        this.setState({
          sId: resp.data.storeId,
          oId: resp.data.orderNum,
          minTime: resp.data.bufferTime,
        });
      });

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var d = new Date();
    var n = d.getDay();
    this.getTimings(days[n]);

    if (!this.props.user.user.isGuest) {
      this.setState({ numVerified: true });
    } else {
      if (this.props.user.user.isGuestVerified) {
        this.setState({ numVerified: true });
      }
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      keyState: true,
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyState: false,
    });
  }
  async getTimings(day) {
    axios
      .get(
        "https://secret-cove-59835.herokuapp.com/v1/storeTimings/" +
          this.props.store.id,
        {
          headers: {
            authorization: this.props.user.token,
          },
        }
      )
      .then((resp) => {
        //
        var ishalf = false;
        for (var i = 0; i < resp.data.result.length; i++) {
          //

          if (resp.data.result[i].day.substring(0, 3) === day) {
            //
            var temp = {};
            if (resp.data.result[i].isClosed === true) {
              temp = {};
            } else {
              if (resp.data.result[i].openTime.includes("30")) {
                ishalf = true;
              }
              var su = "";
              var eu = "";
              if (resp.data.result[i].openTime.includes("PM")) {
                su = "PM";
              } else {
                su = "AM";
              }
              if (resp.data.result[i].closeTime.includes("PM")) {
                eu = "PM";
              } else {
                eu = "AM";
              }

              var st = resp.data.result[i].openTime.substring(0, 2);
              var et = resp.data.result[i].closeTime.substring(0, 2);
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
                var temp2 = parseInt(st) + ":00 " + unit;

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
              temp = resp.data.result[i];
            }

            //need to put logic here :)
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
            mi = 33;
            // hr=6
            //  console.log("todays time",arr)
            //  console.log("current timeeeeeee",pTime)
            //  console.log("STOREEEE TIMINGS",resp.data.storeTimings[i])
            //  console.log("selected Date",this.state.orderDate, pDate)
            console.log(arr);
            if (this.state.orderDate === "" || this.state.orderDate === pDate) {
              console.log("current date");
              //  if(Number(hr) > 12){
              //    hr = Number(hr) - 12
              //  }
              console.log("current hour", Number(hr));
              var result = arr[0].split(" ");
              var result1 = result[0].split(":");
              //  openTime.includes("PM")
              console.log("unit check", arr[0].substring(5, 8));
              var selectedTime = Number(result1[0]);
              if (arr[0].substring(5, 8) === "PM") {
                selectedTime = Number(result1[0]) + 12;
              }

              if (selectedTime === 12) {
                selectedTime = 0;
              }
              console.log("intial timings hour", selectedTime);

              var timesRemove = Number(hr) - selectedTime + 1;
              if (timesRemove < 1) {
                timesRemove = 0;
              }
              console.log("timesRemovetimesRemove", timesRemove);
              console.log("current min", mi);
              console.log("min x min", this.state.minTime);
              var xHours = 0;
              if (Number(this.state.minTime) > 60) {
                xHours = Number(this.state.minTime) / 60;
                console.log("xHours", Math.floor(xHours));
                timesRemove += Math.floor(xHours);
              }
              console.log("after xhours min time", timesRemove);
              var tempMinTime = Number(this.state.minTime);
              if (tempMinTime > 60) {
                tempMinTime = tempMinTime % 60;
              }
              console.log("tempMinTime", tempMinTime);
              if (Number(mi) > tempMinTime && tempMinTime !== 0) {
                timesRemove += 1;
              }
              console.log("timesRemove", timesRemove);

              // var cxHours = 0
              // var closingRemove= arr.length -1
              // if(Number(this.state.minTime) > 60){
              //   console.log("INNNNNNNNNNNNNNNNNNNNNNNNNn")
              //     cxHours = Number(this.state.minTime) /60
              //     console.log("cxHours",Math.ceil(cxHours))
              //     closingRemove =Math.ceil(cxHours)
              // }else if(Number(this.state.minTime) <= 60){
              //     closingRemove =1
              // }else{
              //   closingRemove=0
              // }
              // console.log("closingRemove",closingRemove)
              // console.log("timesRemove final",timesRemove)

              // arr.splice(0, timesRemove)
              // console.log(arr.length,"arr.21length", closingRemove, arr.length-closingRemove, arr.length-1,arr)
              // if(arr.length === 1 && closingRemove > 0){
              //   arr =[]
              // }else{
              //   arr.splice(arr.length-closingRemove, arr.length-1)
              // }
            } else {
              if (!resp.data.result[i].isClosed) {
                var timesRemove = 0;
                if (Number(this.state.minTime) >= 60) {
                  xHours = Number(this.state.minTime) / 60;
                  console.log("xHours", Math.ceil(xHours));
                  timesRemove += Math.ceil(xHours);
                } else if (Number(this.state.minTime) === 30) {
                  timesRemove = 1;
                } else {
                  timesRemove = 0;
                }
                console.log("after xhours min time", timesRemove);
                // var cxHours = 0
                // var closingRemove= arr.length -1
                // if(Number(this.state.minTime) > 60){
                //   console.log("INNNNNNNNNNNNNNNNNNNNNNNNNn")
                //     cxHours = Number(this.state.minTime) /60
                //     console.log("cxHours",Math.ceil(cxHours))
                //     closingRemove =Math.ceil(cxHours)
                // }else if(Number(this.state.minTime) <= 60 && Number(this.state.minTime) > 0){
                //     closingRemove =1
                // }else{
                //   closingRemove=0
                // }
                // arr.splice(0, timesRemove)
                // console.log(arr.length,"arr.21length", closingRemove, arr.length-closingRemove, arr.length-1,arr)
                // if(arr.length === 1 && closingRemove > 0){
                //   arr =[]
                // }else{
                //   arr.splice(arr.length-closingRemove, arr.length-1)
                // }
              } else {
                arr = [];
              }
            }
            console.log("arrrrrr SIZE", arr, resp.data.result[i].isClosed);
            if (resp.data.result[i].isClosed) {
              console.log("111111111111111111111111111");
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
                storeTimeCLose: false,
              });
            } else if (arr.length === 0) {
              console.log("22222222222222222222222222");

              this.setState({
                storeTimings: "",
                start: "",
                end: "",
                startUnit: "",
                endUnit: "",
                timeArray: ["TBD, kashif to give me a text message"],
                orderTime: "",
                tax: resp.data.tax,
                // isStoreClosed: true,
                storeTimeCLose: true,
              });
            } else {
              console.log("3333333333333333333333333333333");

              this.setState({
                storeTimings: resp.data.result[i],
                start: resp.data.result[i].openTime.substring(0, 2),
                end: resp.data.result[i].closeTime.substring(0, 2),
                startUnit: su,
                endUnit: eu,
                timeArray: arr,
                orderTime: arr[0],
                tax: resp.data.tax,
                isStoreClosed: false,
                storeTimeCLose: false,
              });
            }
          }
        }
        //
      })
      .catch((err) => console.log("e2", err));
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
      .catch((err) => console.log("e333", err));

    if (result) {
      return result;
    }

    // ;
  }

  handleConfirm(isOut, sId, storeProducts, subTotal, codeId, todaysDate) {
    // var user = JSON.parse(this.props.user.user);
    var user = this.props.user.user;
    var uid = user.userID ? user.userID : user.userId
    // alert(user.userId)
    console.log("ssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", isOut);
    var orderN =
      this.props.store.id + "-" + Math.floor(Math.random() * 899999 + 100000);
    if (!isOut && !this.state.isOut) {
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
      // console.log(this.state.orderTime, dt, pTime, pDate);
      if (dt === pDate) {
        console.log("sdsd");
        var t1 = pTime.split(":");

        var t2 = this.state.orderTime.split(":");
        // console.log(parseInt(t1[0]), parseInt(t2[0]));
        if (parseInt(t1[0]) >= parseInt(t2[0])) {
          timeCheck = false;
        }
      }
      if (
        EmailValidator.validate(this.state.someOneElseEmail) ||
        this.state.someOneElseEmail === ""
      ) {
        axios
          .post(
            "https://secret-cove-59835.herokuapp.com/v1/transaction",

            {
              storeID: this.props.store.id,
              // products: storeProducts,
              totalAmount: subTotal,
              // storeName: this.props.store.name,
              // storeAddress: this.props.store.address,
              // storePhone: this.props.store.phone,
              customerName: uid,
              // name: this.state.firstName + " " + this.state.lastName,
              // firstName: this.state.firstName,
              // lastName: this.state.lastName,
              // phone: "+1" + this.state.mobile,
              // email: this.state.email,
              pickupTime: this.state.orderTime,
              salesPrice: subTotal,
              pickupDate:
                this.state.orderDate === "" ? todaysDate : this.state.orderDate,
              orderDate: pDate,
              orderTime: pTime,
              tax: (parseFloat(this.props.store.storeTax) / 100) * subTotal,
              orderNumber: orderN,
              isGuest: user.isGuest,
              isSomeOneElse: this.state.isChecked,
              someOneElseFirstName: this.state.someOneElseFirstName,
              someOneElseLastName: this.state.someOneElseLastName,
              someOneElseEmail: this.state.someOneElseEmail,
              someOneElseMobile: this.state.someOneElsePhone,
            },
            {
              headers: {
                authorization: this.props.user.token,
              },
            }
          )
          .then((resp) => {
            alert(JSON.stringify(resp.data));
            for (var i = 0; i < this.props.cart.length; i++) {
              axios
                .post(
                  "https://secret-cove-59835.herokuapp.com/v1/ref_trans_products",

                  {
                    orderID: resp.data.id,
                    itemID: this.props.cart[i].product.itemID,
                    itemQuantity: this.props.cart[i].quantity,
                  },
                  {
                    headers: {
                      authorization: this.props.user.token,
                    },
                  }
                )
                .then((resp1) => {
                  
                  this.props.navigation
                    .navigate("QrCode", {
                      orderId: orderN,
                      codeId: orderN,
                      // order: resp.data.order1,
                    })
                    .catch((err) => alert(JSON.stringify(err)));
                });
            }
            // axios
            //   .put(
            //     "https://lit-peak-13067.herokuapp.com/edit/store/orderNum/" +
            //       this.props.store.id +
            //       "/" +
            //       (parseInt(this.props.store.oId) + 1)
            //   )
            //   .then((resp1) => {
            //     this.props.navigation.navigate("QrCode", {
            //       orderId: resp.data.order1._id,
            //       codeId: codeId,
            //       order: resp.data.order1,
            //     });
            //   })
            //   .catch((err) => console.log("e1", err));
          })
          .catch((err) => alert(JSON.stringify(err)));
      } else {
        alert("Invalid Email of Someone Else Picking");
      }
    } else {
      console.log("pnamepnamepnamepname", pname);
      var name = "";
      if (pname) {
        name = pname;
      } else {
        name = this.state.pname;
      }
      alert(
        "Sorry, " +
          name +
          " Item is out of stock for the selected date, change pickup date or remove this product to procceed"
      );
    }
  }
  //  ejIEyo
  render() {
    var codeId = this.makeid(3);
    // alert(this.props.user.user)
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

    if (this.state.name || this.props.user.user.firstName) {
      nameCheck = true;
    }
    //

    var storeProducts = this.props.cart.filter((item, index) => {
      return item.product.storeId === this.props.store.id;
    });
    var isOut = false;
    var pname = "";

    if (this.state.clickCheck) {
      for (var i = 0; i < storeProducts.length; i++) {
        if (storeProducts[i].product.isOutOfStock) {
          var currentDate = new Date();
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          if (day < 10) {
            day = "0" + day;
          }
          if (month < 10) {
            month = "0" + month;
          }

          var todaysDate1 = year + "-" + month + "-" + day;

          if (todaysDate1 === storeProducts[i].product.outOfStockDate) {
            pname = storeProducts[i].product.productName;
            isOut = true;
          }
        }
        var temp = storeProducts[i].price;
      }
    }
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
    console.log("THIS.STATE", this.state);
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
              onFulfill={(isValid) => {
                if (isValid) {
                  axios
                    .put(
                      "https://lit-peak-13067.herokuapp.com/api/users/guest/edit/verified/" +
                        this.props.user.user._id,
                      {
                        isGuestVerified: true,
                      }
                    )
                    .then((resp) => {
                      var temp = this.props.user.user;
                      temp.isGuestVerified = true;

                      var data = {
                        token: this.props.user.token,
                        user: temp,
                      };

                      this.props.userAsync(data);
                      this.setState(
                        {
                          codeMsg: false,
                          numVerified: true,
                          previousMobileNumber: this.state.mobile,
                        },
                        this.refs.modal6.close()
                      );
                    })
                    .catch((err) => console.log("e4", err));
                } else {
                  this.setState({ codeMsg: true });
                }
              }}
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
                    this.setState({
                      pname: "",
                      isOut: false,
                      clickCheck: false,
                    });
                    isOut = false;
                    pname = "";
                    this.getTimings(this.getDayName(index));
                    console.log("sdsdadasd213", dates[item]);
                    for (var i = 0; i < storeProducts.length; i++) {
                      if (storeProducts[i].product.isOutOfStock) {
                        var currentDate = new Date();
                        var day = currentDate.getDate();
                        var month = currentDate.getMonth() + 1;
                        var year = currentDate.getFullYear();
                        if (day < 10) {
                          day = "0" + day;
                        }
                        if (month < 10) {
                          month = "0" + month;
                        }

                        var todaysDate1 = day + "-" + month + "-" + year;
                        console.log(
                          "aaaaaaaaaaaaaaaa",
                          dates[item],
                          storeProducts[i].product.outOfStockDate
                        );
                        if (
                          dates[item] ===
                          storeProducts[i].product.outOfStockDate
                        ) {
                          this.setState({
                            isOut: true,
                            pname: storeProducts[i].product.productName,
                          });
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
                disabled={index === "Store Closed"}
                onPress={() => {
                  console.log("selected timingssss", index);

                  this.setState({ times: item, orderTime: index });
                }}
                style={
                  index !== "Store Closed"
                    ? this.state.times == item
                      ? styles.tSelect
                      : styles.tUnSelect
                    : styles.ctSelect
                }
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={
                    index !== "Store Closed"
                      ? this.state.times == item
                        ? "white"
                        : "#5C5C5C"
                      : "black"
                  }
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
                        onChangeText={(mobile) => {
                          if (this.state.previousMobileNumber !== mobile) {
                            this.setState({ numVerified: false });
                          } else {
                            this.setState({ numVerified: true });
                          }
                          this.setState({
                            mobile,
                          });
                        }}
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
                  if (
                    EmailValidator.validate(this.state.email) ||
                    this.state.email === ""
                  ) {
                    if (this.state.firstName && this.state.lastName) {
                      nameCheck = true;
                    }

                    var mob = false;
                    if (this.state.mobile.substring(0, 2) === "+1") {
                      mob = true;
                    }
                    var verifyCheck = true;
                    // console.log(
                    //   this.state.previousMobileNumber,
                    //   this.state.mobile
                    // );
                    if (this.state.previousMobileNumber !== this.state.mobile) {
                      verifyCheck = false;
                    } else {
                      verifyCheck = true;
                    }
                    console.log("SDDDDDDDDDDDDDDDDDDDDDDDDDDs33", verifyCheck);
                    axios
                      .put(
                        "https://lit-peak-13067.herokuapp.com/api/users/guest/edit/" +
                          this.props.user.user._id,
                        {
                          firstName: this.state.firstName,
                          lastName: this.state.lastName,
                          email: this.state.email,
                          mobile: this.state.mobile
                            ? "+1" + this.state.mobile
                            : this.state.mobile,
                          isGuestVerified: verifyCheck,
                          // mobile: mob ?  (this.state.mobile) : ("+1" + this.state.mobile),
                        }
                      )
                      .then(async (resp) => {
                        var temp = this.props.user.user;
                        temp.firstName = this.state.firstName;
                        temp.lastName = this.state.lastName;
                        temp.email = this.state.email;

                        temp.mobile = "+1" + this.state.mobile;

                        var data = {
                          token: this.props.user.token,
                          user: temp,
                        };

                        this.props.userAsync(data);

                        this.refs.modal4.close();
                      })
                      .catch((err) => console.log("ee", err));

                    this.refs.modal4.close();
                  } else {
                    alert("Invalid Email");
                  }
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
            <KeyboardAvoidingView behavior={"position"}>
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
                  source={{ uri: this.state.image }}
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
                  ) : this.state.storeTimeCLose ? (
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={15}
                      col={"#2E2E2E"}
                      txtAlign={"center"}
                      text={"    TBD message"}
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
                  text={this.state.firstName + " " + this.state.lastName}
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
                    this.state.mobile
                      ? "+1" + this.state.mobile
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
                    disabled={!this.state.mobile}
                    onPress={async () => {
                      // this.props.navigation.navigate("Checkout1")

                      var num = Math.floor(100000 + Math.random() * 900000);
                      await this.setState({ num: num.toString() });
                      this.forceUpdate();
                      // var numV;
                      // if (this.props.user.user.mobile) {
                      //   numV = this.props.user.user.mobile;
                      // } else {
                      //   numV = "+1" + this.state.mobile;
                      // }
                      // var emailV;
                      // if (this.props.user.user.email) {
                      //   emailV = this.props.user.user.email;
                      // } else {
                      //   emailV = this.state.email;
                      // }

                      // console.log("numv", numV);
                      axios
                        .get(
                          "https://lit-peak-13067.herokuapp.com/api/number/verification/" +
                            "+1" +
                            this.state.mobile +
                            "/" +
                            num
                        )
                        .then((resp) => {
                          // console.log(resp);

                          this.refs.modal6.open();
                        })
                        .catch((err) => console.log("sdf", err));
                    }}
                    style={[
                      !this.state.mobile
                        ? btnStyles.cartBtnOutline1
                        : btnStyles.cartBtnOutline,
                      { width: "35%" },
                    ]}
                  >
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={18}
                      col={!this.state.mobile ? "silver" : "#2E2E2E"}
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
                    marginBottom: 20,
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
                              text={"Enter First Name"}
                            />
                          </View>
                          <View>
                            <TextInput
                              style={[textIn.input, { width: "100%" }]}
                              onChangeText={(someOneElseFirstName) =>
                                this.setState({
                                  someOneElseFirstName,
                                })
                              }
                              value={this.state.someOneElseFirstName}
                            />
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
                              text={"Enter Last Name"}
                            />
                          </View>
                          <View>
                            <TextInput
                              style={[textIn.input, { width: "100%" }]}
                              onChangeText={(someOneElseLastName) =>
                                this.setState({
                                  someOneElseLastName,
                                })
                              }
                              value={this.state.someOneElseLastName}
                            />
                          </View>
                        </View>
                        <View>
                          <View
                            style={{ marginBottom: 5, marginTop: wp("6%") }}
                          >
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
                              onChangeText={(someOneElsePhone) =>
                                this.setState({
                                  someOneElsePhone,
                                })
                              }
                              value={this.state.someOneElsePhone}
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
                            autoCapitalize={"none"}
                            onChangeText={(someOneElseEmail) =>
                              this.setState({
                                someOneElseEmail,
                              })
                            }
                            value={this.state.someOneElseEmail}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </KeyboardAvoidingView>
          </ScrollView>
          {!this.state.keyState && (
            <View style={bottomTab.cartSheet}>
              <TouchableOpacity
                disabled={
                  this.state.storeTimings.isClosed ||
                  !nameCheck ||
                  !this.state.numVerified ||
                  this.state.isStoreClosed ||
                  this.state.storeTimeCLose
                }
                onPress={() =>
                  this.handleConfirm(
                    isOut,
                    sId,
                    storeProducts,
                    subTotal,
                    codeId,
                    todaysDate
                  )
                }
                style={[
                  this.state.storeTimings.isClosed ||
                  !nameCheck ||
                  !this.state.numVerified ||
                  this.state.isStoreClosed ||
                  this.state.storeTimeCLose
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
          )}
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
  ctSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "silver",
    color: "#000",
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
