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
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Font from "expo-font";
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
import { userAsync, cartLoading } from "../store/actions";
import { connect } from "react-redux";
import { getUniqueId, getManufacturer } from "react-native-device-info";
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
    };
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
    //Unique Id
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
  handleLogin = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        if (this.state.email) {
          if (EmailValidator.validate(this.state.email)) {
            if (this.state.password) {
              console.log("Pressed");
              axios
                .post(
                  "https://sheltered-scrubland-52295.herokuapp.com/api/users/signin",
                  {
                    email: this.state.email.toLowerCase(),
                    password: this.state.password,
                  }
                )
                .then((resp) => {
                  // alert(JSON.stringify(resp));
                  console.log(resp.data)
                  if (resp.data === "Incorrect password.") {
                    // this.props.userAsync(resp.data);
                    this.setState({
                      errMessage: "Password is incorrect",
                      loading: false,
                    });
                    Î;
                  } else if(resp.data === "Email does not exist."){
                    // this.props.navigation.navigate("Map");
                    this.setState({errMessage: "Email does not exist.",
                    loading: false,
                  })
                  }else{
                      this.props.userAsync(resp.data);
                      this.props.navigation.navigate("Map");

                  }
                })
                .catch((err) =>
                  this.setState({ msg: err.message, loading: false })
                );
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

  handleForgot = () => {
    Alert.alert(
      "Reset Password",
      "A password reset link has been sent to your Email. Please check your inbox. Also, don’t forget to check your spam folder",
      [
        {
          text: "Dismiss",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Okay",
          onPress: () =>
            axios
              .get(
                "https://sheltered-scrubland-52295.herokuapp.com/api/forgot/password/" +
                  this.state.email
              )
              .then((resp) => console.log(resp))
              .catch((err) => console.log(err)),
        },
      ],
      { cancelable: false }
    );
  };
  render() {
    console.log("state L", this.state);
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
              onPress={this.handleForgot}
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginTop: 10,
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#B50000"
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
                col="#B50000"
                text={" New memeber? Sign up "}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 20 }}
              onPress={() => {
                // alert(getUniqueId())
                var resp = {
                  token: "guest",
                  user: {
                    name: "guest",
                    _id: getUniqueId(),
                    email: "",
                    mobile: "",
                    zipCode: "",
                  },
                };

                this.props.userAsync(resp);
                this.props.navigation.navigate("Map");
                console.log("geust resp", resp);
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#B50000"
                text={"Skip this and continue as guest"}
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
