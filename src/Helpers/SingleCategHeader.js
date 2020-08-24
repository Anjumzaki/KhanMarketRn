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
import firebase from "firebase";

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
import {
  storeAsync,
  cartAsync,
  cartSizeAsync,
  singleCatAsync,
  search1Async,
} from "../store/actions";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";

class SingleCategHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      image: "",
    };
  }

  componentWillMount() {
    const ref = firebase
      .storage()
      .ref("/store_images/" + this.props.store1.id + ".jpg");
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
          height: 120 + getStatusBarHeight(),
          width: Dimensions.get("window").width,
          justifyContent: "flex-end",
          padding: 5,
          paddingTop: 0,
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
            height: 120 + getStatusBarHeight(),
            width: Dimensions.get("window").width,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          // source={require("../../assets/bgheader.png")}
          source={{ uri: this.state.image }}
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
            onPress={() => this.props.navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" color="white" size={25} />
          </TouchableOpacity>
          <View style={{ padding: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="white"
              text={this.props.name}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Cart")}
            style={{ padding: 20 }}
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
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={styles.wrapperText}>
            <EvilIcons name="search" size={26} color="#89898c" />
            <TextInput
              style={styles.textI}
              placeholder="Search..."
              onChangeText={(inputText) => {
                this.setState({ inputText });
                this.props.search1Async(inputText);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Filters")}
          >
            <Image source={require("../../assets/filters.png")} />
          </TouchableOpacity>
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
    color: "#000000",
  },
  wrapperText: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "87%",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 5,
    paddingLeft: 20,
    marginLeft: 10,
    opacity: 0.9,
    height: 40,

    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  store: state.Store.storeData,
  cartData: state.Cart.cartData,
  cartSize: state.CartSize.cartSizeData,
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  name: state.SingleCatName.singleCatData,
  cartLength: state.CartSize.cartSizeData,
  searchInput: state.Search.searchData,
  store1: state.storeHeader.storeData1,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      storeAsync,
      cartAsync,
      cartSizeAsync,
      singleCatAsync,
      search1Async,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SingleCategHeader);
