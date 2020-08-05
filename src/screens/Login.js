import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import Geolocation from "@react-native-community/geolocation";
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Font from "expo-font";
import * as EmailValidator from "email-validator";
import { CommonActions } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync, locationAsync } from "../store/actions";
import { connect } from "react-redux";
import { getUniqueId, getManufacturer } from "react-native-device-info";
import jwt from "jwt-decode";
class Login extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);

    this.state = {
      icEye: "visibility-off",
      isPassword: true,
      fontLoaded: false,
      email: "",
      password: "",
      msg: "",
      mainLoading: false,
    };
  }
  async componentDidMount() {
    // const jsonValue1 = "";
    // const jsonValue1 = await AsyncStorage.getItem("user");
    // var jsonValue = JSON.parse(jsonValue1);
    // if (jsonValue) {
    //   await axios
    //     .get("https://lit-peak-13067.herokuapp.com/get/user/byId/" + jsonValue)
    //     .then(async (resp) => {
    //       console.log("res[p", resp.data);
    //       await this.props.userAsync({ user: resp.data });
    //     })
    //     .catch((err) => console.log("err1", err));
    //   var flag = false;
    //   await axios
    //     .get("https://lit-peak-13067.herokuapp.com/get/location/" + jsonValue)
    //     .then(async (resp1) => {
    //       console.log("res[p1", resp1.data);
    //       if (resp1.data.length === 0) {
    //         console.log("iffffffffffffffffff");
    //         this.props.navigation.navigate("Map");
    //       } else {
    //         console.log("elseeeeeeeeeeeeeeeeeeeeee");
    //         flag = true;
    //         this.props.locationAsync({
    //           location:
    //             resp1.data[0].address1 +
    //             " " +
    //             resp1.data[0].address2 +
    //             " " +
    //             resp1.data[0].city +
    //             " " +
    //             resp1.data[0].country,
    //           lat: resp1.data[0].latitude,
    //           lng: resp1.data[0].longitude,
    //         });
    //       }
    //     })
    //     .catch((err) => console.log("err2", err));
    //   // alert("blew")
    //   if (flag) {
    //     this.setState(
    //       {
    //         mainLoading: false,
    //       },
    //       () => this.props.navigation.navigate("App")
    //     );
    //   }
    // } else {
    //   this.setState({
    //     mainLoading: false,
    //   });
    // }
  }
  getRef = (ref) => {
    if (this.props.getRef) this.props.getRef(ref);
  };
  changePwdType = () => {
    const { isPassword } = this.state;
    // set new state value
    this.setState({
      icEye: isPassword ? "visibility" : "visibility-off",
      isPassword: !isPassword,
    });
  };
  handleApp = async (value, token, loc) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value));
      await AsyncStorage.setItem("token", token);
      // alert(token);
      // await AsyncStorage.setItem("user", JSON.stringify(value));
      // await AsyncStorage.setItem("userLocation", JSON.stringify(loc));
    } catch (e) {
      alert(error);
    }
    alert(JSON.stringify(loc));
    alert(JSON.stringify(this.props.user));
    this.props.locationAsync({
      location:
        loc.result[0].address1 +
        " " +
        loc.result[0].address2 +
        " " +
        loc.result[0].city +
        " " +
        loc.result[0].country,
      lat: loc.result[0].lat,
      lng: loc.result[0].lng,
    });
    this.setState(
      {
        icEye: "visibility-off",
        isPassword: true,
        fontLoaded: false,
        email: "",
        password: "",
        msg: "",
        loading: false,
      },
      // alert(token)

      () => this.props.navigation.navigate("App")
    );
    const user = await AsyncStorage.getItem("user");
    const anjum = await AsyncStorage.getItem("token");
    alert(anjum);
  };
  handleMap = async (value, token) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value));
      await AsyncStorage.setItem("token", token);
      // alert(token);
    } catch (e) {
      // saving error
    }
    this.setState(
      {
        icEye: "visibility-off",
        isPassword: true,
        fontLoaded: false,
        email: "",
        password: "",
        msg: "",
        loading: false,
      },
      () => this.props.navigation.navigate("Map")
      // alert(token)
    );
    const user = await AsyncStorage.getItem("user");
    const anjum = await AsyncStorage.getItem("token");
    alert(anjum);
  };
  handleLogin = async () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        if (this.state.email.trim()) {
          if (EmailValidator.validate(this.state.email.trim())) {
            if (this.state.password) {
              axios
                .post("https://secret-cove-59835.herokuapp.com/v1/login/user", {
                  email: this.state.email.toLowerCase().trim(),
                  password: this.state.password,
                })
                .then(async (resp) => {
                  this.setState({ errMessage: false });
                  // alert(JSON.stringify(resp.data.token));
                  const token = resp.data.token;
                  const user = jwt(resp.data.token);
                  // await AsyncStorage.setItem("user", JSON.stringify(user));
                  // await AsyncStorage.setItem("token", JSON.stringify(token));
                  // alert(resp.data.token);
                  this.props.userAsync({ user: { user } });

                  // alert(JSON.stringify(user.shippingAddress));
                  if (Number(user.shippingAddress) > 0) {
                    axios
                      .post(
                        "https://secret-cove-59835.herokuapp.com/v1/location/" +
                          Number(user.shippingAddress),
                        { a: "fg" },
                        {
                          headers: {
                            authorization: token,
                          },
                        }
                      )
                      .then((resp1) => {
                        this.handleApp(user, token, resp1.data);
                        console.log(resp1.data);
                      })
                      .catch((err) => console.log(err));
                  } else {
                    this.handleMap(user, token);
                  }
                })
                .catch((err) => {
                  this.setState({
                    errMessage: "Incorrect Email or password",
                    loading: false,
                  });
                });
            } else {
              this.setState({
                errMessage: "Please Enter Your Password",
                loading: false,
              });
            }
          } else {
            this.setState({
              errMessage: "Please enter a valid email",
              loading: false,
            });
          }
        } else {
          this.setState({
            errMessage: "Please Enter Your Email",
            loading: false,
          });
        }
      }
    );
  };

  handleForgot() {
    var txt = "";
    if (this.state.email.trim()) {
      txt =
        "A password reset link has been sent to your Email. Please check your inbox. Also, don’t forget to check your spam folder";
    } else {
      txt = "Please enter your email first";
    }
    var that = this;
    Alert.alert(
      "Reset Password",
      txt,
      [
        that.state.email
          ? ({
              text: "Dismiss",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Send",
              onPress: () =>
                axios
                  .get(
                    "https://lit-peak-13067.herokuapp.com/api/forgot/password/" +
                      this.state.email.toLowerCase().trim()
                  )
                  .then((resp) => console.log(resp))
                  .catch((err) => console.log(err)),
            })
          : {
              text: "Okay",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
      ],
      { cancelable: true }
    );
    // }{
    //   Alert.alert(
    //     "Reset Password",
    //     "Please enter your email first",
    //     [
    //       {
    //         text: "Okay",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel",
    //       }
    //     ],
    //     { cancelable: true }
    //   );
    // }
  }
  render() {
    const { icEye, isPassword } = this.state;
    // console.log(DeviceInfo.getUniqueID())

    const styles = StyleSheet.create({
      logo: {
        width: wp("60%"),
        alignSelf: "center",
      },
      icon: {
        position: "absolute",
        right: 10,
        paddingTop: 8,
      },
      myText: { fontSize: hp("5%") },
    });
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "white" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
        {this.state.mainLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color="gray" size="large" />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={conStyles.scroll}
          >
            <Image
              style={styles.logo}
              source={require(".././../assets/logo.png")}
              resizeMode="contain"
            />
            <View
              style={{
                justifyContent: "flex-start",
                paddingHorizontal: wp("10%"),
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#000000"
                text={"SIGN IN"}
              />
              <View style={textIn.Flabel}>
                <View>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#5C5C5C"
                    text={"Email address"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    onChangeText={(email) =>
                      this.setState({
                        email: email,
                      })
                    }
                    value={this.state.email.toLowerCase().trim()}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
              <View>
                <View style={textIn.label}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#5C5C5C"
                    text={"Password"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    secureTextEntry={isPassword}
                    onChangeText={(password) => {
                      this.setState({
                        password,
                      });
                    }}
                    autoCapitalize="none"
                    value={this.state.password}
                  />
                  <Icon
                    style={styles.icon}
                    name={icEye}
                    size={20}
                    color={"#000000"}
                    onPress={this.changePwdType}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => this.handleForgot()}
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 10,
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="red"
                  text={"Forgot Password?"}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {this.state.errMessage && (
                <>
                  <Image
                    style={{ marginRight: 10 }}
                    source={require("../../assets/Vector.png")}
                  />
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="red"
                    text={this.state.errMessage || ""}
                  />
                </>
              )}
            </View>
            <View
              style={{
                justifyContent: "space-evenly",

                paddingHorizontal: wp("10%"),
              }}
            >
              <TouchableOpacity
                style={btnStyles.basic}
                onPress={() => this.handleLogin()}
              >
                {this.state.loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="white"
                    text={"SIGN IN"}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 20 }}
                onPress={() => this.props.navigation.navigate("SignUp1")}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="green"
                  text={" New memeber? Sign up "}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 20 }}
                onPress={() => {
                  axios
                    .post(
                      "https://lit-peak-13067.herokuapp.com/api/users/guest/register",
                      {
                        isGuest: true,
                        guestId: getUniqueId(),
                      }
                    )
                    .then(async (resp) => {
                      await AsyncStorage.setItem(
                        "user",
                        JSON.stringify(resp.data.user._id)
                      );

                      axios
                        .get(
                          "https://lit-peak-13067.herokuapp.com/get/location/" +
                            resp.data.user._id
                        )
                        .then((resp1) => {
                          this.props.userAsync(resp.data);
                          // this.props.navigation.navigate("Map");
                          if (resp1.data.length > 0) {
                            this.props.locationAsync({
                              location:
                                resp1.data[0].address1 +
                                " " +
                                resp1.data[0].address2 +
                                " " +
                                resp1.data[0].city +
                                " " +
                                resp1.data[0].country,
                              lat: resp1.data[0].latitude,
                              lng: resp1.data[0].longitude,
                            });

                            this.props.navigation.navigate("App");
                          } else {
                            this.props.navigation.navigate("Map");
                          }
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) =>
                      this.setState({ msg: "Email already exist!" })
                    );
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="green"
                  text={"Skip this and continue as guest"}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
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
      locationAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
