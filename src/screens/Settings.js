import React from "react";
import { View, Text, Image, TextInput, Switch, Button } from "react-native";
import LatoText from "../Helpers/LatoText";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { btnStyles, bottomTab, lines } from "../styles/base";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: true,
      isEnabled1: true,
      image: null,
    };
  }
  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(ImagePicker.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
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
            source={require("../../assets/Ellipse20.png")}
          />
          <TouchableOpacity
            onPress={()=>this._pickImage()}
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
