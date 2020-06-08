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
  // Modal
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
      firstName: "",
      lastName: "",
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
      verifi: false,
      countryModal: false,
      selectedCountry: "USA",
    };
  }
  isValidUSZip = (sZip) => {
    // return /^\d{5}(-\d{4})?$/.test(sZip);
    return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(sZip);
  };
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
        if (this.state.firstName.trim()) {
          if (this.state.lastName.trim()) {
          if (this.state.email.trim()) {
            if (EmailValidator.validate(this.state.email.trim())) {
              if (this.state.mobile.trim()) {
                if (this.state.zipCode.trim()) {
                  if (this.isValidUSZip(this.state.zipCode)) {
                    this.setState({ errMessage: "", loading: false });
                    this.props.navigation.navigate("ChoosePass", {
                      firstName: this.state.firstName,
                      lastName: this.state.lastName,
                      email: this.state.email.toLowerCase().trim(),
                      mobile:
                        this.state.selectedCountry == "USA"
                          ? "+1" + this.state.mobile
                          : "+92" + this.state.mobile,
                      zipCode: this.state.zipCode,
                      password: this.state.password,
                      isGuest: false,
                      guestId: "",
                    });
                  } else {
                    this.setState({
                      errMessage: "Please enter correct USA Zip code",
                      loading: false,
                    });
                  }
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
            errMessage: "Please enter your last name",
            loading: false,
          });
        }
        } else {
          this.setState({
            errMessage: "Please enter your first name",
            loading: false,
          });
        }
      }
    );
  };
  render() {
    var mainNumber =
      this.state.selectedCountry === "USA"
        ? "+1" + this.state.mobile
        : "+92" + this.state.mobile;
    console.log(mainNumber);
    const { icEye, isPassword } = this.state;
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "white" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
        <Modal
          style={[
            styles.modal,
            styles.modal3,
            { justifyContent: "space-between" },
          ]}
          position={"center"}
          ref={"coModal"}
          isDisabled={this.state.countryModal}
        >
          <LatoText
            fontName="Lato-Regular"
            fonSiz={20}
            col="#5C5C5C"
            text={"Please select the Coutry"}
          />
          <View style={{ paddingBottom: 10 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={12}
            col="#5C5C5C"
            txtAlign={"center"}
            text={"Here are the availiable country"}
          />
          <View style={{ paddingBottom: 10 }} />

          <TouchableOpacity
            onPress={() =>
              this.setState(
                { selectedCountry: "PAK" },
                this.refs.coModal.close()
              )
            }
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: wp("8%"), height: wp("5%") }}
              source={require("../../assets/pak.png")}
            />
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                paddingLeft: 5,
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={"+92"}
              />
            </View>
          </TouchableOpacity>
          <View style={{ paddingBottom: 10 }} />
          <TouchableOpacity
            onPress={() =>
              this.setState(
                { selectedCountry: "USA" },
                this.refs.coModal.close()
              )
            }
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: wp("8%"), height: wp("5%") }}
              source={require("../../assets/america.png")}
            />
            <View
              style={{
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
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.refs.coModal.close()}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="green"
              txtAlign={"center"}
              text={"close"}
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
              keyboardType={"number-pad"}
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
              col="green"
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
                      email: email,
                    })
                  }
                  value={this.state.email.trim()}
                  autoCapitalize="none"
                  keyboardType={"email-address"}
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
              <TouchableOpacity
                onPress={() => this.refs.coModal.open()}
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {this.state.selectedCountry == "USA" ? (
                  <>
                    <Image
                      style={{ width: wp("8%") }}
                      source={require("../../assets/america.png")}
                    />
                    <View
                      style={{
                        minWidth: "20%",
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
                  </>
                ) : (
                  <>
                    <Image
                      style={{ width: wp("8%"), height: wp("5%") }}
                      source={require("../../assets/pak.png")}
                    />
                    <View
                      style={{
                        minWidth: "20%",
                        justifyContent: "center",
                        alignContent: "center",
                        paddingLeft: 5,
                      }}
                    >
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"+92"}
                      />
                    </View>
                  </>
                  
                )}

                <TextInput
                  placeholder={"(555) 555-5678"}
                  keyboardType={"numeric"}
                  onChangeText={(mobile) =>
                    mobile.length < 10
                      ? this.setState({
                          mobile,
                        })
                      : this.setState({
                          mobile,
                          verifi: true,
                        })
                  }
                  value={this.state.mobile}
                  style={[textIn.input, { width: "70%" }]}
                />
              </TouchableOpacity>
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
                ) : this.state.verifi ? (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: "#5c5c5c",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    onPress={async () => {
                      if (this.state.email) {
                        if (this.state.mobile) {
                          var num = Math.floor(100000 + Math.random() * 900000);
                          await this.setState({ num: num.toString() });
                          this.forceUpdate();
                          axios
                            .get(
                              "https://lit-peak-13067.herokuapp.com/get/user/" +
                                this.state.email.trim()
                            )
                            .then((resp) => {
                              axios
                                .get(
                                  "https://lit-peak-13067.herokuapp.com/get/user/number/" +
                                    mainNumber
                                )
                                .then((resp1) => {
                                  console.log("sddsdd", resp.data, resp1.data);
                                  if (resp.data === null) {
                                    if (resp1.data === null) {
                                      var cd = "1";
                                      if (this.state.selectedCountry == "PAK") {
                                        cd = "92";
                                      }
                                      console.log("CDDDDDDDDD", cd);
                                      axios
                                        .get(
                                          "https://lit-peak-13067.herokuapp.com/api/email/verification/" +
                                            this.state.email
                                              .toLowerCase()
                                              .trim() +
                                            "/" +
                                            num
                                        )
                                        .then((resp) => this.refs.modal3.open())
                                        .catch((err) => console.log(err));

                                      axios
                                        .get(
                                          "https://lit-peak-13067.herokuapp.com/api/number/verification/" +
                                            mainNumber +
                                            "/" +
                                            num
                                        )
                                        .then((resp) => this.refs.modal3.open())
                                        .catch((err) =>
                                          console.log("num err", err)
                                        );
                                    } else {
                                      this.setState({
                                        errMessage:
                                          "There is already an account assoicated with this phone number.",
                                      });
                                    }
                                  }else{
                                    this.setState({errMessage: "There is already an account assoicated with this email address"})
                                  }
                                })
                                .catch((err) => console.log(err))
                                .catch((err) => console.log(err));
                            });
                        } else {
                          this.setState({
                            errMessage: "Please Enter Phone Number.",
                          });
                        }
                      } else {
                        this.setState({ errMessage: "Please Enter Email." });
                      }
                    }}
                  >
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#5c5c5c"
                      text={"Verify"}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: "#c9c9c9",
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    onPress={async () => {
                      alert("Please enter correct number");
                    }}
                  >
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#c9c9c9"
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
                    keyboardType={"number-pad"}
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
                  col="red"
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
              disabled={!this.state.numVerified}
              style={[
                btnStyles.basic,
                !this.state.numVerified ? { backgroundColor: "silver" } : null,
              ]}
              onPress={() => this.handleSignUp()}
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="white"
                  text={"Next"}
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
                col="green"
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
