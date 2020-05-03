import React from "react";
import { View, Text, Image, TextInput, Switch, Button } from "react-native";
import LatoText from "../Helpers/LatoText";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { btnStyles, bottomTab, lines } from "../styles/base";
import ImagePicker from "react-native-image-picker";
const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      isEnabled1: true,
      image: null,
      images: null,
      avatarSource: null,
    };
  }

  render() {
    let { image } = this.state;
    return (
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
                : require("../../assets/Ellipse20.png")
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
            <TouchableOpacity style={{ paddingHorizontal: 20 }}>
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
              style={{ fontSize: 17 }}
              value={"Bernard Murphy"}
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
              value={"(555) 576 349"}
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
              value={"b.murhpy@gmail.com"}
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
            <TouchableOpacity style={{ paddingHorizontal: 20 }}>
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
        <TouchableOpacity style={{ marginTop: 30 }}>
          <LatoText
            fontName="Lato-Bold"
            fonSiz={15}
            col="black"
            text="Sign Out"
          />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
