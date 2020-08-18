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

import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as EmailValidator from "email-validator";
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
      mainLoading: true,
    };
  }
  async componentDidMount() {
    // alert(getUniqueId());
    console.log(getUniqueId());
    var user = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    // alert(user);
    if (user) {
      user = JSON.parse(user);
      if ((user && user.userID) || user.userId) {
        var uID = user.userID ? user.userID : user.userId;
        axios
          .get(
            "https://secret-cove-59835.herokuapp.com/v1/user/" + uID,

            {
              headers: {
                authorization: token,
              },
            }
          )
          .then(async (resp) => {
            if (resp.data.success == "true") {
              this.setState({ errMessage: false });
              const user = resp.data.result[0];
              await AsyncStorage.removeItem("user");
              await AsyncStorage.setItem("user", JSON.stringify(user));
              if (user.shippingAddress) {
                console.log(user.address2);
                await this.props.userAsync({ user, token });
                await this.props.locationAsync({
                  location: user.address1 + " " + user.address2,
                  type: "user",
                  address1: user.address1,
                  address2: user.address2,
                  city: user,
                  country: user.country,
                  state: user.state,
                  zipCode: user.zipCode,
                  lat: user.lat,
                  lng: user.lng,
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
                    mainLoading: false,
                  },
                  () =>
                    this.props.navigation.navigate("App", {
                      token: token,
                      user: user,
                    })
                );
              } else {
                this.props.userAsync({ user, token });
                this.setState(
                  {
                    icEye: "visibility-off",
                    isPassword: true,
                    fontLoaded: false,
                    email: "",
                    password: "",
                    msg: "",
                    loading: false,
                    mainLoading: false,
                  },
                  () =>
                    this.props.navigation.navigate("Map", {
                      token: token,
                      user: user,
                    })
                );
              }
            } else {
              this.setState({
                errMessage: "Fuck OFF",
                loading: false,
                mainLoading: false,
              });
            }
            // alert(JSON.stringify(resp));
          });
      } else {
        this.setState({ mainLoading: false });
      }
    } else {
      this.setState({ mainLoading: false });
    }
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
                  await AsyncStorage.setItem("user", JSON.stringify(user));
                  await AsyncStorage.setItem("token", token);
                  if (user.shippingAddress) {
                    console.log(user.address2);
                    this.props.userAsync({ user, token });
                    this.props.locationAsync({
                      location: user.address1 + user.address2,
                      type: "user",
                      address1: user.address1,
                      address2: user.address2,
                      city: user,
                      country: user.country,
                      state: user.state,
                      zipCode: user.zipCode,
                      lat: user.lat,
                      lng: user.lng,
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
                        mainLoading: false,
                      },
                      () =>
                        this.props.navigation.navigate("App", {
                          token: token,
                          user: user,
                        })
                    );
                  } else {
                    this.props.userAsync({ user, token });
                    this.setState(
                      {
                        icEye: "visibility-off",
                        isPassword: true,
                        fontLoaded: false,
                        email: "",
                        password: "",
                        msg: "",
                        loading: false,
                        mainLoading: false,
                      },
                      () =>
                        this.props.navigation.navigate("Map", {
                          token: token,
                          user: user,
                        })
                    );
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
                onPress={() =>
                  axios
                    .post("https://secret-cove-59835.herokuapp.com/v1/guest", {
                      firstName: "",
                      lastName: "",
                      email: "",
                      mobile: "",
                      password: "",
                      isGuest: 1,
                      type: "user",
                      guestID: getUniqueId(),
                    })
                    .then((resp) => {
                      if (resp.data.id) {
                        axios
                          .post(
                            "https://secret-cove-59835.herokuapp.com/v1/login/guest",
                            {
                              guestID: getUniqueId(),
                              isGuest: 1,
                              isGuestVerified: 0,
                            }
                          )
                          .then(async (resp) => {
                            this.setState({ errMessage: false });
                            // alert(JSON.stringify(resp.data.token));
                            const token = resp.data.token;
                            const user = jwt(resp.data.token);
                            await AsyncStorage.setItem(
                              "user",
                              JSON.stringify(user)
                            );
                            await AsyncStorage.setItem("token", token);
                            alert(user.shippingAddress);
                            if (
                              user.shippingAddress &&
                              user.shippingAddress != "undefined"
                            ) {
                              console.log(user.address2);
                              this.props.userAsync({ user, token });
                              this.props.locationAsync({
                                location: user.address1 + user.address2,
                                type: "user",
                                address1: user.address1,
                                address2: user.address2,
                                city: user,
                                country: user.country,
                                state: user.state,
                                zipCode: user.zipCode,
                                lat: user.lat,
                                lng: user.lng,
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
                                  mainLoading: false,
                                },
                                () =>
                                  this.props.navigation.navigate("App", {
                                    token: token,
                                    user: user,
                                  })
                              );
                            } else {
                              this.props.userAsync({ user, token });
                              this.setState(
                                {
                                  icEye: "visibility-off",
                                  isPassword: true,
                                  fontLoaded: false,
                                  email: "",
                                  password: "",
                                  msg: "",
                                  loading: false,
                                  mainLoading: false,
                                },
                                () =>
                                  this.props.navigation.navigate("Map", {
                                    token: token,
                                    user: user,
                                  })
                              );
                            }
                          })
                          .catch((err) => {
                            this.setState({
                              errMessage: "Incorrect Email or password",
                              loading: false,
                              mainLoading: false,
                            });
                          });
                      } else {
                        this.setState({ mainLoading: false });
                      }
                    })

                    .catch((err) =>
                      this.setState({
                        msg: JSON.stringify(err),
                        mainLoading: false,
                      })
                    )
                }
                style={{ alignItems: "center", marginTop: 20 }}
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
