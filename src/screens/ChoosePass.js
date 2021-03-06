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
} from "react-native";
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Font from "expo-font";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import BarPasswordStrengthDisplay from "react-native-password-strength-meter";

import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync } from "../store/actions";
import { connect } from "react-redux";

class SignUp1 extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);

    this.state = {
      icEye: "visibility-off",
      isPassword: true,
      icEye1: "visibility",
      isPassword1: true,
      fontLoaded: false,
      user: {},
      errMessage: "",
      score: "",
      password: "",
      score: "",
    };
  }
  async componentDidMount() {
    this.setState({ user: this.props.route.params });
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
  changePwdType1 = () => {
    const { isPassword1 } = this.state;
    // set new state value
    this.setState({
      icEye1: isPassword1 ? "visibility-off" : "visibility",
      isPassword1: !isPassword1,
    });
  };
  handleSignUp = () => {
    if (this.state.password) {
      if (this.state.password.length > 5) {
        if (this.state.score > 40) {
          if (this.state.password == this.state.coPassword) {
            axios
              .post(
                "https://secret-cove-59835.herokuapp.com/v1/user",
                this.state.user
              )
              .then((resp) => {
                this.props.userAsync(resp.data);
                Alert.alert(
                  "Account Created",
                  "Please Login",
                  [
                    {
                      text: "OK",
                      onPress: () => this.props.navigation.navigate("Login"),
                    },
                  ],
                  { cancelable: false }
                );
              })

              .catch((err) =>
                this.setState({ msg: JSON.stringify(err) }, console.log(err))
              );
          } else {
            this.setState({
              errMessage: "Password and confirm password does not matches",
            });
          }
        } else {
          this.setState({
            errMessage:
              "Password needs to be strong, please add symbols or numbers",
          });
        }
      } else {
        this.setState({
          errMessage: "Password must contain minimum 6 characters",
        });
      }
    } else {
      this.setState({
        errMessage: "Please enter password",
      });
    }
  };
  onChange = (score) => {
    this.setState(score);
  };
  render() {
    console.log("stas", this.state);
    const { icEye, isPassword, icEye1, isPassword1 } = this.state;
    const styles = StyleSheet.create({
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
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "white" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
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
            <View style={{ paddingTop: 30 }}>
              <View style={textIn.label}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={"Password"}
                />
              </View>
              <View>
                <BarPasswordStrengthDisplay
                  wrapperStyle={{
                    width: "100%",
                    backgroundColor: "green",
                    paddingLeft: 0,
                    marginLeft: 0,
                  }}
                  onChangeText={(password, score) => {
                    this.setState({
                      password,
                      score,
                    });
                    this.state.user.password = password;
                  }}
                  password={this.state.password}
                  meterType="text"
                  autoCapitalize="none"
                />

                {/* <TextInput
                  style={textIn.input}
                  secureTextEntry={isPassword}
                  onChangeText={(password) => {
                    this.setState({
                      password,
                    });
                    this.state.user.password = password;
                  }}
                  autoCapitalize="none"
                  value={this.state.password}
                /> */}
                {/* <Icon
                  style={styles.icon}
                  name={icEye}
                  size={20}
                  color={"#000000"}
                  onPress={this.changePwdType}
                /> */}
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 10,
                }}
              ></TouchableOpacity>
            </View>
            <View style={{ paddingTop: 10 }}>
              <View style={textIn.label}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={"Confirm Password"}
                />
              </View>
              <View>
                <TextInput
                  style={textIn.input}
                  secureTextEntry={isPassword1}
                  onChangeText={(coPassword) => {
                    this.setState({
                      coPassword,
                    });
                  }}
                  autoCapitalize="none"
                  value={this.state.coPassword}
                />
                <Icon
                  style={styles.icon}
                  name={icEye1}
                  size={20}
                  color={"#000000"}
                  onPress={this.changePwdType1}
                />
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 10,
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#89898C"
                  text={"At least 6 charachters"}
                />
              </TouchableOpacity>
            </View>

            <View></View>
          </View>
          <View style={{ paddingHorizontal: 40 }}>
            <Text
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
              }}
            >
              {this.state.msg}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
            }}
          >
            {this.state.errMessage != "" && (
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
              onPress={() => this.handleSignUp()}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="white"
                text={"Sign Up"}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SignUp1);
