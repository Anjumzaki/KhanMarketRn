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
import {  cartAsync, cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync } from "../store/actions";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";

class LastHeader extends React.Component {
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
          }}
          source={require("../../assets/bgheader.png")}
          resizeMode="cover"
        />
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ padding: 20 }}
            onPress={() => {
              this.props.storeAsync('')
              this.props.cartSizeAsync(0)
              this.props.storeHeaderAsync('')
              this.props.favStoreAsync('')
              this.props.navigation.navigate('Home')}}
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
      storeAsync
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LastHeader);
