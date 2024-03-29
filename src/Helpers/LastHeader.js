import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  TextInput,
  StatusBar,
} from "react-native";
import { conStyles, headerStyles } from "../styles/base";

import {
  Entypo,
  Feather,
  FontAwesome,
  EvilIcons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import LatoText from "./LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import firebase from "firebase";

import {
  cartAsync,
  cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync,
} from "../store/actions";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";

class LastHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
    };
  }
  componentWillMount() {
    const ref = firebase
      .storage()
      .ref("/store_images/" + this.props.store.id + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <View
        style={{
          height: 65 + getStatusBarHeight(),
          width: Dimensions.get("window").width,
          justifyContent: "flex-end",
          backgroundColor: "transparent",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 3.84,
          borderTopWidth: 0,
          elevation: 5,
        }}
      >
        <Image
          style={{
            height: 65 + getStatusBarHeight(),
            width: Dimensions.get("window").width,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          
          source={
            this.props.store.id
              ? { uri: this.state.image }
              : require("../../assets/bgheader.png")
          }
          resizeMode="cover"
        />
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
        
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ padding: 20 }}
            onPress={() => { 
              if(this.props.nameTitle === "ORDER PLACED"){
                this.props.storeAsync("");
                this.props.cartSizeAsync(0);
                this.props.storeHeaderAsync("");
                this.props.favStoreAsync("");
              }
              if(this.props.nameTitle === "PICK UP DETAILS"){
                this.props.navigation.navigate("Cart");
              }else{
                this.props.navigation.navigate("Home");
              }

            }}
          >
            <MaterialIcons name="arrow-back" color="white" size={25} />
          </TouchableOpacity>
          <View style={{ padding: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="white"
              text={this.props.nameTitle}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Cart")}
              style={{ padding: 20 }}
            >
              {this.props.cart ? (
                <View>
                  <View style={headerStyles.cartTxt}>
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={7}
                      col="white"
                      text={this.props.cartLength}
                    />
                  </View>
                  <MaterialIcons
                    name="shopping-cart"
                    size={26}
                    color={"white"}
                  />
                </View>
              ) : (
                <View style={{ paddingHorizontal: 20 }} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textI: {
    width: "100%",
    paddingLeft: 5,
    fontSize: 17,
  },
  wrapperText: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "94%",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 5,
    paddingLeft: 20,
    marginLeft: 10,
    marginBottom: 10,
    opacity: 0.9,
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  store: state.Store.storeData,
  cartData: state.Cart.cartData,
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  cartLength: state.CartSize.cartSizeData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
      favStoreAsync,
      storeHeaderAsync,
      storeAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LastHeader);
