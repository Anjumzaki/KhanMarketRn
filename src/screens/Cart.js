import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  LinearGradient,
  VirtualizedList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from "react-native";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import { btnStyles, bottomTab, lines } from "../styles/base";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import CartCardImage from "../Components/CartCardImage.js";
import CartCard from "../Components/cartCards.js";

import axios from "axios";
import firebase from "firebase";

// const DATA = this.props.cart;

const getItem = (data, index) => {
  return {
    // id: Math.random().toString(12).substring(0),
    // title: `Item ${index+1}`
    product: item,
    index: index,
    isFeatured: item.isFeatured,
    id: item.product._id,
  };
};

const getItemCount = (data) => {
  return data.length;
};

const Item = ({ item, index }) => {
  return (
    // <View style={styles.item}>
    //   <Text style={styles.title}>{title}</Text>
    // </View>
    <CartCard
      product={item}
      index={index}
      isFeatured={item.isFeatured}
      id={item.product._id}
    />
  );
};

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      image: "",
      tax: "",
      isStore: true,
      imagesLoading: false,
      cartItem: [],
      imageL: false,
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

      this.setState({ tax: this.props.store.storeTax });
    } else {
      this.setState({ isStore: false });
    }
    this.setState({
      cartItem: this.props.cart,
    });
    // alert(JSON.stringify(this.props.store));
  }
  handleRemove = (id) => {
    this.setState(
      {
        imageL: true,
      },
      () => {
        var sp = id;
        var temp = this.props.cart;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].product.productID === sp) {
            console.log("selcted", temp[i].product.productName);
            if (i > -1) {
              temp.splice(i, 1);
            }
          }
        }
        this.setState(
          {
            cartData: temp,
            imageL: false,
          },
          () => this.props.cartAsync(temp)
        );
      }
    );
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 0) {
      this.setState({ qt: preNum });
    }
  }
  renderMet = () => {
    this.setState(
      {
        imagesLoading: !this.state.imagesLoading,
      }
      // alert(this.imagesLoading)
    );
  };
  render() {
    console.log("CART PROPS NEW RENDER", this.props.cart);
    // alert(JSON.stringify(this.props.cart))

    // var myCart = this.props.cart.length;
    var subTotal = 0;

    for (var i = 0; i < this.props.cart.length; i++) {
      var temp = parseFloat(this.props.cart[i].price);
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
          {!this.state.imageL && (
            <VirtualizedList
              data={this.props.cart}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              renderItem={({ item, index }) => (
                <CartCard
                  product={item}
                  index={index}
                  isFeatured={item.isFeatured}
                  id={item.product.productID}
                  handleRe={this.handleRemove}
                />
              )}
            />
          )}

          {/* {this.state.cartItem.map((item, index) => (
            <View>
              {this.state.imageL ? (
                <ActivityIndicator name="black" />
              ) : (
                <CartCardImage id={item.product._id} />
              )}

              <Text>{item.product.productName}</Text>
              <TouchableOpacity
                onPress={() => this.handleRemove(item.product._id)}
              >
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>
          ))} */}
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
            <View style={{ width: '100%', marginBottom: 15 }}>

              <TextInput onChangeText={(specialInstructions) => this.setState({ specialInstructions })} multiline={true} style={{ width: '100%', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, paddingTop: 15, height: 100 }} placeholder="Special Instructions" />
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity
                onPress={() => {
                  if (this.props.cart.length === 0) {
                    alert("Sorry, cart is empty.");
                  } else {
                    this.props.navigation.navigate("Checkout1", { specialInstructions: this.state.specialInstructions });
                  }
                }}
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
                onPress={() => this.props.navigation.navigate("SignUp1")}
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

          </View>
        ) : (
            <View style={bottomTab.cartSheet}>
              <View style={{ width: '100%', marginBottom: 15 }}>

                <TextInput onChangeText={(specialInstructions) => this.setState({ specialInstructions })} multiline={true} style={{ width: '100%', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, paddingTop: 15, height: 100 }} placeholder="Special Instructions" />
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.cart.length === 0) {
                    alert("You cart is empty.");
                  } else {
                    this.props.navigation.navigate("Checkout1", { specialInstructions: this.state.specialInstructions });
                  }
                }}
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
