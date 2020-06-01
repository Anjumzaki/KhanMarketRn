import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  LinearGradient,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { AntDesign } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import CartCard from "../Components/cartCards.js";
import axios from "axios";
import firebase from "firebase";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      image: "",
      tax: "",
      isStore: true,
    };
  }

  componentDidMount() {
    if (this.props.store) {
      const ref = firebase
        .storage()
        .ref("/store_logos/" + this.props.store.id + ".jpg");
      ref
        .getDownloadURL()
        .then((url) => {
          this.setState({ image: url });
        })
        .catch((err) => console.log(err));

      axios
        .get(
          "https://lit-peak-13067.herokuapp.com/get/store/" +
            this.props.store.id
        )
        .then((resp) => {
          this.setState({ tax: resp.data.tax });
        });
    } else {
      this.setState({ isStore: false });
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };

  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }

  render() {
    var storeProducts = this.props.cart.filter((item, index) => {
      return item.product.storeId === this.props.store.id;
    });

    var subTotal = 0;

    for (var i = 0; i < storeProducts.length; i++) {
      // var temp = (this.props.cart[i].product.price - ((this.props.cart[i].product.price * this.props.cart[i].product.discount)/100) * this.props.cart[i].quantity)
      var temp = this.props.cart[i].price;
      // var temp=0
      subTotal = subTotal + parseFloat(temp);
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          {this.state.isStore ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 30,
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 44, height: 44, marginRight: 10 }}
                source={{ uri: this.state.image }}
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#2E2E2E"
                text={this.props.store.name}
              ></LatoText>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 30,
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#2E2E2E"
                text="No Store Selected"
              ></LatoText>
            </View>
          )}

          <View style={lines.simple} />
          {storeProducts.map((item, index) => (
            <CartCard
              product={item}
              index={index}
              isFeatured={item.isFeatured}
              id={item.product._id}
            />
          ))}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Subtotal"
            ></LatoText>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text={`$${subTotal.toFixed(2)}`}
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text="Tax"
            ></LatoText>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text={
                "$" +
                (
                  (parseFloat(this.state.tax ? this.state.tax : 0) / 100) *
                  subTotal
                ).toFixed(2)
              }
            ></LatoText>
          </View>
          <View style={lines.simple} />
          {subTotal.toFixed(2) > 0 ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 5,
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={22}
                col="#2E2E2E"
                text="Total"
              ></LatoText>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={25}
                col="#2E2E2E"
                text={
                  "$" +
                  parseFloat(
                    parseFloat(
                      (
                        (parseFloat(this.state.tax ? this.state.tax : 0) /
                          100) *
                        subTotal
                      ).toFixed(2)
                    ) + parseFloat(subTotal.toFixed(2))
                  ).toFixed(2)
                }
              ></LatoText>
            </View>
          ) : null}
        </ScrollView>

        {this.props.user.user.isGuest ? (
          <View style={bottomTab.cartSheet}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Checkout1")}
              style={[btnStyles.cartBtnOutline, { width: "55%" }]}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#2E2E2E"
                text="CONTINUE AS GUEST"
              ></LatoText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
              style={[btnStyles.cartBtn, { width: "40%" }]}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="white"
                text="SIGN IN/UP"
              ></LatoText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={bottomTab.cartSheet}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Checkout1")}
              style={[btnStyles.cartBtn, { width: "100%" }]}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="white"
                text="Checkout"
              ></LatoText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imgCon: {
    width: Dimensions.get("window").width,
    height: 250,
  },
  topRight: {
    alignSelf: "flex-end",
  },
  wrapTop: {
    alignSelf: "flex-end",

    marginTop: 30,
    backgroundColor: "#7cba80",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  bottomText: {
    height: 200,
    flexDirection: "row",
  },
  buybBtn: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
  store: state.Store.storeData,
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
