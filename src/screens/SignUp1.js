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
  ActivityIndicator,
} from "react-native";
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modalbox";
import CodeInput from "react-native-confirmation-code-input";
import * as EmailValidator from "email-validator";

import * as Font from "expo-font";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChangeText as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";

import LatoText from "../Helpers/LatoText";
import axios from "axios";

export default class SignUp1 extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      icEye: "visibility-off",
      isPassword: true,
      fontLoaded: false,
      name: "",
      email: "",
      mobile: "",
      zipCode: "",
      password: "",
      isOpen: false,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      codeMsg: false,
      numVerified: false,
      num: "",
      loading: false,
      errMessage: "",
      loading: false,
      verifi:false
    };
  }
  onClose() {
    console.log("Modal just closed");
  }

  onOpen() {
    console.log("Modal just opened");
  }

  onClosingState(state) {
    console.log("the open/close of the swipeToClose just changed");
  }
  async componentDidMount() {
    await Font.loadAsync({
      "Lato-Light": require("../../assets/fonts/Lato-Light.ttf"),
      "Lato-Bold": require("../../assets/fonts/Lato-Bold.ttf"),
      "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
      "Sarabun-Regular": require("../../assets/fonts/Sarabun-Regular.ttf"),
      "Sarabun-Medium": require("../../assets/fonts/Sarabun-Medium.ttf"),
      "Sarabun-Light": require("../../assets/fonts/Sarabun-Light.ttf"),
    });

    this.setState({ fontLoaded: true });
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
  handleSignUp = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        if (this.state.name) {
          if (this.state.email) {
            if (EmailValidator.validate(this.state.email)) {
              if (this.state.mobile) {
                if (this.state.zipCode) {
                  this.props.navigation.navigate("ChoosePass", {
                    name: this.state.name,
                    email: this.state.email.toLowerCase(),
                    mobile: this.state.mobile,
                    zipCode: this.state.zipCode,
                    password: this.state.password,
                    isGuest: false,
                    guestId: "",
                  });
                } else {
                  this.setState({
                    errMessage: "Please enter Zip code",
                    loading: false,
                  });
                }
              } else {
                this.setState({
                  errMessage: "Please enter mobile number",
                  loading: false,
                });
              }
            } else {
              this.setState({
                errMessage: "Please enter correct email",
                loading: false,
              });
            }
          } else {
            this.setState({
              errMessage: "Please enter your email",
              loading: false,
            });
          }
        } else {
          this.setState({
            errMessage: "Please enter your name",
            loading: false,
          });
        }
      }
    );
  };
  render() {
    const { icEye, isPassword } = this.state;
    console.log("this", this.state);
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "white" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
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
            text={"Please enter the code!"}
          />
          <View style={{ paddingBottom: 10 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={15}
            col="#5C5C5C"
            txtAlign={"center"}
            text={"A 6-digit code has been sent to your number and E-mail"}
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
                      this.refs.modal3.close()
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
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{ paddingLeft: 30, paddingTop: 30, paddingBottom: 10 }}
        >
          <Image source={require("../../assets/back.png")} />
        </TouchableOpacity>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            conStyles.scroll,
            { justifyContent: "space-around" },
          ]}
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
              text={"SIGN UP"}
            />
            <View style={textIn.Flabel}>
              <View>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={"Name"}
                />
              </View>
              <View>
                <TextInput
                  style={textIn.input}
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
              <View style={textIn.label}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={"Email Address"}
                />
              </View>
              <View>
                <TextInput
                  style={textIn.input}
                  onChangeText={(email) =>
                    this.setState({
                      email,
                    })
                  }
                  value={this.state.email}
                />
              </View>
            </View>
            <View>
              <View style={textIn.label}>
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
                    mobile.length < 10 ?
                    this.setState({
                      mobile,
                    }) :
                    this.setState({
                      mobile,
                      verifi:true
                    })
                  }
                  value={this.state.mobile}
                  style={[textIn.input, { width: wp("64%") }]}
                />
              </View>

              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                {this.state.numVerified ? (
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#2AA034"
                    text={"Verified"}
                  />
                ) : (
                  !this.state.verifi ?
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: "#C9C9C9",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    onPress={async () => {
                      var num = Math.floor(100000 + Math.random() * 900000);
                      await this.setState({ num: num.toString() });
                      this.forceUpdate();

                      axios
                        .get(
                          "https://sheltered-scrubland-52295.herokuapp.com/api/email/verification/" +
                            this.state.email +
                            "/" +
                            num
                        )
                        .then((resp) => this.refs.modal3.open())
                        .catch((err) => console.log(err));

                      axios
                        .get(
                          "https://sheltered-scrubland-52295.herokuapp.com/api/number/verification/" +
                            "+" +
                            this.state.mobile +
                            "/" +
                            num
                        )
                        .then((resp) => this.refs.modal3.open())
                        .catch((err) => console.log(err));
                    }}
                  >
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#C9C9C9"
                      text={"Verify"}
                    />
                  </TouchableOpacity> :
                   <TouchableOpacity
                   style={{
                     paddingHorizontal: 20,
                     paddingVertical: 10,
                     borderColor: "#5C5C5C",
                     borderWidth: 1,
                     borderRadius: 5,
                   }}
                 >
                   <LatoText
                     fontName="Lato-Regular"
                     fonSiz={17}
                     col="#5C5C5C"
                     text={"Verify"}
                   />
                 </TouchableOpacity>
                )}
              </View>
              <View>
                <View style={textIn.label}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#5C5C5C"
                    text={"Zip Code"}
                  />
                </View>
                <View>
                  <TextInput
                    placeholder={"00000"}
                    style={textIn.input}
                    onChangeText={(zipCode) =>
                      this.setState({
                        zipCode,
                      })
                    }
                    value={this.state.zipCode}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {this.state.errMessage !== "" && (
              <>
                <Image
                  style={{ marginRight: 10 }}
                  source={require("../../assets/Vector.png")}
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={this.state.errMessage}
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
              onPress={() => this.handleSignUp()}
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="white"
                  text={"Verify"}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 20 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#B50000"
                text={"Already a member Sign In "}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
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
    height: 230,
    width: Dimensions.get("window").width - 100,
  },

  modal4: {
    height: 300,
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent",
  },

  text: {
    color: "black",
    fontSize: 22,
  },
  logo: {
    width: wp("30%"),
    alignSelf: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    paddingTop: 8,
  },
  myText: { fontSize: hp("5%") },
});
