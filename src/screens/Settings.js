import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Switch,
  Button,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import LatoText from "../Helpers/LatoText";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { btnStyles, bottomTab, lines } from "../styles/base";
import ImagePicker from "react-native-image-picker";
import Modal from "react-native-modalbox";
import { bindActionCreators } from "redux";
import { cartAsync, userAsync } from "../store/actions";
import { connect } from "react-redux";
import firebase from "firebase";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import UserDefault from "../../assets/icon-user-default.png";

const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      isEnabled1: true,
      image: null,
      images: null,
      avatarSource: null,
      editName1: false,
      editName2: false,
      firstName: this.props.user.user.firstName,
      lastName: this.props.user.user.lastName,
      image: "",
      old: "",
      newP: "",
      isDisabled: false,
      spinner: false,
    };
  }

  componentDidMount() {
    const ref = firebase
      .storage()
      .ref("profile_images/" + this.props.user.user._id + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async editlastName() {
    // var myUser = await AsyncStorage.getItem("user");

    // myUser = JSON.parse(myUser)
    // myUser.user.firstName = this.state.firstName
    // myUser.user.lastName = this.state.lastName
    // await AsyncStorage.setItem('user',JSON.stringify(myUser))
    axios
      .put(
        "https://lit-peak-13067.herokuapp.com/edit/user/lastName/" +
          this.props.user.user._id +
          "/" +
          this.state.lastName
      )
      .then((resp) => {
        var temp = this.props.user;
        temp.user.lastName = this.state.lastName;

        this.props.userAsync(temp);
      })
      .catch((err) => console.log(err));
  }

  editFirstName() {
    axios
      .put(
        "https://lit-peak-13067.herokuapp.com/edit/user/name/" +
          this.props.user.user._id +
          "/" +
          this.state.firstName
      )
      .then((resp) => {
        var temp = this.props.user;
        temp.user.firstName = this.state.firstName;

        this.props.userAsync(temp);
      })
      .catch((err) => console.log(err));
    this.editlastName();
  }

  editPass() {
    if (this.state.old) {
      if (this.state.newP) {
        axios
          .put(
            "https://lit-peak-13067.herokuapp.com/api/users/reset/password/" +
              this.state.old +
              "/" +
              this.state.newP +
              "/" +
              this.props.user.user.email
          )
          .then((resp) => {
            console.log(resp);
            if (resp.data.success == "true") {
              this.setState(
                {
                  editPassing: false,
                  spinner: false,
                },
                () => alert("Password changed successfully ")
              );
            } else if (resp.data.success == "false") {
              this.setState(
                {
                  spinner: false,
                },
                () => alert("Incorrect Old Password")
              );
            } else {
              this.setState(
                {
                  spinner: false,
                },
                () => alert("Something went wrong")
              );
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.setState(
          {
            spinner: false,
          },
          () => alert("Please enter new password")
        );
      }
    } else {
      this.setState(
        {
          spinner: false,
        },
        () => alert("Please enter old password")
      );
    }
  }

  uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("profile_images/" + this.props.user.user._id + ".jpg");
    return ref.put(blob);
  };

  render() {
    let { image } = this.state;
    return (
      <>
        <ScrollView
          contentContainerStyle={{ padding: 20, backgroundColor: "white" }}
        >
          <View style={{ marginTop: 20 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={25}
            col="#5C5C5C"
            text="Account Settings"
          />
          <View style={{ marginTop: 20 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* <Image
              style={{ width: 80, height: 80, borderRadius: 80 }}
              source={
                this.state.avatarSource
                  ? { uri: this.state.avatarSource.uri }
                  : this.state.image && { uri: this.state.image }
              }
            /> */}
            {this.state.image ? (
              <Image
                style={{ width: 60, height: 60, borderRadius: 100 }}
                source={{ uri: this.state.image }}
              />
            ) : (
              <Image
                style={{ width: 60, height: 60, borderRadius: 100 }}
                source={UserDefault}
              />
            )}
            <TouchableOpacity
              onPress={() =>
                ImagePicker.showImagePicker(options, (response) => {
                  if (response.didCancel) {
                  } else if (response.error) {
                  } else if (response.customButton) {
                  } else {
                    const source = { uri: response.uri };
                    // this.saveImage(source);
                    this.uploadImage(source.uri)
                      .then((resp) => Alert("success"))
                      .then((err) => Alert(err));

                    this.setState({
                      avatarSource: source,
                    });
                  }
                })
              }
              style={{ paddingHorizontal: 20 }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={15}
                col="black"
                text="Change"
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 30 }} />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#5C5C5C"
                text="First Name"
              />
              {this.state.editName1 ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ editName1: false, editName2: false });
                    this.editFirstName();
                  }}
                  style={{ paddingHorizontal: 20 }}
                >
                  <LatoText
                    fontName="Lato-Bold"
                    fonSiz={15}
                    col="black"
                    text="Save"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ editName1: true, editName2: true })
                  }
                  style={{ paddingHorizontal: 20 }}
                >
                  <LatoText
                    fontName="Lato-Bold"
                    fonSiz={15}
                    col="black"
                    text="Change"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ paddingTop: 15 }}>
              <TextInput
                onChangeText={(firstName) => this.setState({ firstName })}
                editable={this.state.editName1}
                style={
                  this.state.editName1
                    ? {
                        borderColor: "#5C5C5C",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        color: "#000000",
                      }
                    : {
                        borderColor: "white",
                        borderWidth: 1,
                        borderRadius: 5,
                        color: "#000000",
                      }
                }
                value={this.state.firstName}
              />
            </View>
          </View>

          <View style={{ marginTop: 30 }} />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#5C5C5C"
                text="Last Name"
              />
            </View>
            <View style={{ paddingTop: 15 }}>
              <TextInput
                onChangeText={(lastName) => this.setState({ lastName })}
                editable={this.state.editName2}
                style={
                  this.state.editName2
                    ? {
                        borderColor: "#5C5C5C",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        color: "#000000",
                      }
                    : {
                        borderColor: "white",
                        borderWidth: 1,
                        borderRadius: 5,
                        color: "#000000",
                      }
                }
                value={this.state.lastName}
              />
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#5C5C5C"
                text="Phone number"
              />
            </View>
            <View style={{ paddingTop: 15 }}>
              <TextInput
                editable={false}
                style={{ fontSize: 17, color: "#000000" }}
                value={this.props.user.user.mobile}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#5C5C5C"
                text="Email"
              />
            </View>
            <View style={{ paddingTop: 15 }}>
              <TextInput
                editable={false}
                style={{ fontSize: 17, color: "#000000" }}
                value={this.props.user.user.email}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }} />
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#5C5C5C"
                text="Password"
              />

              {this.state.spinner ? (
                <ActivityIndicator color="black" size="small" />
              ) : this.state.editPassing ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ spinner: true }, this.editPass());
                  }}
                  style={{ paddingHorizontal: 20 }}
                >
                  <LatoText
                    fontName="Lato-Bold"
                    fonSiz={15}
                    col="black"
                    text="Save"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({ editPassing: true })}
                  style={{ paddingHorizontal: 20 }}
                >
                  <LatoText
                    fontName="Lato-Bold"
                    fonSiz={15}
                    col="black"
                    text="Change"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ paddingTop: 15, paddingBottom: 20 }}>
              {this.state.editPassing ? (
                <View>
                  <TextInput
                    placeholder={"Old Password"}
                    style={{
                      borderColor: "#5c5c5c",
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginBottom: 20,
                      color: "#000000",
                    }}
                    onChangeText={(old) => this.setState({ old })}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                  />
                  <TextInput
                    placeholder={"New Password"}
                    style={{
                      borderColor: "#5c5c5c",
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      color: "#000000",
                    }}
                    onChangeText={(newP) => this.setState({ newP })}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                  />
                </View>
              ) : (
                <TextInput
                  editable={false}
                  autoCapitalize={"none"}
                  secureTextEntry={true}
                  style={{ fontSize: 17, color: "#000000" }}
                  value={"Bernard Murphy"}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </>
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
});

const mapStateToProps = (state) => ({
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
