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
import axios from "axios";
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
      editName: false,
      name: this.props.user.user.name,
      image: "",
      old: "",
      newP: "",
    };
  }

  componentDidMount() {
    const ref = firebase
      .storage()
      .ref("profile_images/" + this.props.user.user._id + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        console.log("Imageee urllllllllll", url);
        this.setState({ image: url });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editName() {
    axios
      .put(
        "https://sheltered-scrubland-52295.herokuapp.com/edit/user/name/" +
          this.props.user.user._id +
          "/" +
          this.state.name
      )
      .then((resp) => {
        var temp = this.props.user;
        console.log("before user", temp);
        temp.user.name = this.state.name;
        console.log("after user", temp);

        this.props.userAsync(temp);

        console.log(resp);
      })
      .then(() => this.refs.modal3.close)
      .catch((err) => console.log(err));
  }

  editPass() {
    console.log("In edit pass");
    axios
      .put(
        "https://sheltered-scrubland-52295.herokuapp.com/api/users/reset/password/" +
          this.state.old +
          "/" +
          this.state.newP +
          "/" +
          this.props.user.user.email
      )
      .then((resp) => {
        console.log(resp);
        if (resp.data.success == "true") {
          alert("Password chaged succesfully ");
          this.refs.modal3.close();
        } else if (resp.data.success == "false") {
          alert("Password mismatch");
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.log(err));
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
        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          isDisabled={this.state.isDisabled}
        >
          <View
            style={{
              flex: 1,
              padding: 15,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View>
              <TextInput
                placeholder={"Old Password"}
                style={{
                  borderColor: "#5c5c5c",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 20,
                }}
                onChangeText={(old) => this.setState({ old })}
              />
              <TextInput
                placeholder={"New Password"}
                style={{
                  borderColor: "#5c5c5c",
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                }}
                onChangeText={(newP) => this.setState({ newP })}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
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
                  this.editPass();
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
        <ScrollView
          contentContainerStyle={{ padding: 20, backgroundColor: "white" }}
        >
          <View style={{ marginTop: 20 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={25}
            col="#5C5C5C"
            text="Profile"
          />
          <View style={{ marginTop: 20 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Image
              style={{ width: 80, height: 80, borderRadius: 80 }}
              source={
                this.state.avatarSource
                  ? { uri: this.state.avatarSource.uri }
                  : this.state.image && { uri: this.state.image }
              }
            />
            <TouchableOpacity
              onPress={() =>
                ImagePicker.showImagePicker(options, (response) => {
                  console.log("Response = ", response);
                  if (response.didCancel) {
                    console.log("User cancelled image picker");
                  } else if (response.error) {
                    console.log("ImagePicker Error: ", response.error);
                  } else if (response.customButton) {
                    console.log(
                      "User tapped custom button: ",
                      response.customButton
                    );
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
                text="Name"
              />
              {this.state.editName ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ editName: false });
                    this.editName();
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
                  onPress={() => this.setState({ editName: true })}
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
                onChangeText={(name) => this.setState({ name })}
                editable={this.state.editName}
                style={
                  this.state.editName
                    ? {
                        borderColor: "#5C5C5C",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                      }
                    : { borderColor: "white", borderWidth: 1, borderRadius: 5 }
                }
                value={this.state.name}
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
                style={{ fontSize: 17 }}
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
                style={{ fontSize: 17 }}
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
              <TouchableOpacity
                onPress={() => this.refs.modal3.open()}
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
            <View style={{ paddingTop: 15 }}>
              <TextInput
                editable={false}
                secureTextEntry={true}
                style={{ fontSize: 17 }}
                value={"Bernard Murphy"}
              />
            </View>
          </View>
          <View style={[lines.simple, { marginVertical: 30 }]} />
          <View style={{ marginTop: 0 }} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={25}
            col="#5C5C5C"
            text="General"
          />
          <View style={{ marginTop: 20 }} />
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
              fonSiz={18}
              col="#5C5C5C"
              text="Email notifications"
            />
            <Switch
              trackColor={{ false: "#5C5C5C", true: "#2AA034" }}
              thumbColor={this.state.isEnabled ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                this.setState({ isEnabled: !this.state.isEnabled })
              }
              value={this.state.isEnabled}
            />
          </View>
          <View style={{ marginTop: 20 }} />
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
              fonSiz={18}
              col="#5C5C5C"
              text="Sms notifications"
            />
            <Switch
              trackColor={{ false: "#5C5C5C", true: "#2AA034" }}
              thumbColor={this.state.isEnabled1 ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                this.setState({ isEnabled1: !this.state.isEnabled1 })
              }
              value={this.state.isEnabled1}
            />
          </View>
          <View style={[lines.simple, { marginVertical: 30 }]} />
          <TouchableOpacity>
            <LatoText
              fontName="Lato-Bold"
              fonSiz={15}
              col="black"
              text="Terms & conditions"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={() => {
              this.props.userAsync("");
              this.props.navigation.navigate("Login");
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={15}
              col="black"
              text="Sign Out"
            />
          </TouchableOpacity>
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
