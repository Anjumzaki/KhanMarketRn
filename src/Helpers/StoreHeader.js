import React from "react";
import { View, Image, StatusBar } from "react-native";
import { headerStyles } from "../styles/base";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import LatoText from "./LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import { storeAsync, cartAsync } from "../store/actions";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";

class StoreHeader extends React.Component {
  render() {
    return (
      <View
        style={{ backgroundColor: "#2E2E2E", paddingTop: getStatusBarHeight() }}
      >
        <StatusBar translucent={true} barStyle="light-content" />
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
            onPress={() => this.props.navigation.toggleDrawer()}
          >
            <Image source={require("../../assets/menu-1.png")} />
          </TouchableOpacity>
          <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="white"
              text={"STORES NEAR YOU"}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Cart")}
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
          >
            <View>
              <View style={headerStyles.cartTxt}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={7}
                  col="white"
                  text={this.props.cartLength}
                />
              </View>
              <MaterialIcons name="shopping-cart" size={26} color={"white"} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15,
          }}
          onPress={() => this.props.navigation.navigate("HomeMap")}
        >
          <EvilIcons name="location" size={26} color={"white"} />
          <View>
            <LatoText
              fontName="Lato-Light"
              fonSiz={17}
              col="white"
              text={
                this.props.userLocation.location &&
                this.props.userLocation.location.substring(0, 42)
              }
              textDec={"underline"}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  store: state.Store.storeData,
  cartData: state.Cart.cartData,
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  cartLength: state.CartSize.cartSizeData,
  userLocation: state.Location.locationData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      storeAsync,
      cartAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StoreHeader);
