import React, { Component } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Image, Text } from "react-native";
import LatoText from "../Helpers/LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import firebase from "firebase";

// function CustomDrawerContent(props)
class CustomDrawerContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
    };
  }

  componentDidMount() {
    const ref = firebase
      .storage()
      .ref("profile_images/" + this.props.user.user._id + ".jpg");
    ref.getDownloadURL().then((url) => {
      this.setState({ image: url });
    }).catch((err)=>{
      console.log(err)
    });
  }

  render() {
    console.log("bar propsssssssssssssssssssssssss", this.props);
    console.log("bar stateeeeeee", this.state);
    return (
      <DrawerContentScrollView
        style={{ backgroundColor: "#5C5C5C" }}
        {...this.props}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Profile")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 30,
            borderBottomColor: "#89898C",
            borderBottomWidth: 1,
            marginBottom: 30,
          }}
        >
          <View>
            {this.state.image != '' && <Image style={{width:60,height:60,borderRadius:100}} source={{ uri: this.state.image }} />}
          </View>

          <View style={{ paddingLeft: 10 }}>
            <LatoText
              col="#FFFFFF"
              fontName={"Lato-Bold"}
              fontSiz={20}
              text={this.props.user.user.name}
            />
            <View style={{ paddingTop: 2 }}>
              <LatoText
                col="#FFFFFF"
                fontName={"Lato-LightItalic"}
                fontSiz={12}
                text="Profile 90% complete"
              />
            </View>
          </View>
        </TouchableOpacity>
        <DrawerItemList {...this.props} />
      </DrawerContentScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDrawerContent);
