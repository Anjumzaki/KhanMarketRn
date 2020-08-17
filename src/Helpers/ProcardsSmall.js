import React from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "./LatoText";
import { btnStyles } from "../styles/base";
import { bindActionCreators } from "redux";
import {
  cartAsync,
  cartSizeAsync,
  storeAsync,
  favStoreAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";

class ProCards extends React.Component {
  state = {
    heart: false,
    image: "",
    qt: 1,
    favourites: [],
  };

  componentDidMount() {
    const ref = firebase
      .storage()
      .ref("/product_images/" + this.props.product.productID + "_1.jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));

    if (this.props.product.favourites === undefined) {
      this.setState({ favourites: [] });
    } else {
      for (var i = 0; i < this.props.product.favourites.length; i++) {
        if (
          this.props.product.favourites[i].userId === this.props.user.user._id
        ) {
          this.setState({ heart: true });
        }
      }
      this.setState({ favourites: this.props.product.favourites });
    }

    var pCart = this.props.cart;
    var inCart = false;
    var inCartIndex = "";
    for (var i = 0; i < pCart.length; i++) {
      if (pCart[i].product._id === this.props.product._id) {
        inCart = true;
        inCartIndex = i;
        break;
      }
    }

    if (inCart) {
      console.log(
        "inCarttttttttttt",
        inCart,
        inCartIndex,
        pCart[inCartIndex].quantity
      );
      this.setState({ cart: true, qt: pCart[inCartIndex].quantity });
    }
  }

  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }

    var pCart = this.props.cart;
    var that = this;
    pCart.map(function (pro, ind) {
      if (pro.product.productName === that.props.product.productName) {
        pro.quantity = that.state.qt + num;
      }
    });

    this.props.cartAsync(pCart);
  }

  render() {
    var cSize = 0;
    for (var i = 0; i < this.props.cart.length; i++) {
      cSize = cSize + parseInt(this.props.cart[i].quantity);
    }

    this.props.cartSizeAsync(cSize);
    return (
      <View style={styles.procards}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("ProductDetails", {
              product: this.props.product,
            })
          }
        >
          <ImageBackground
            style={styles.proCardsImage}
            source={{ uri: this.state.image }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (this.state.heart === false) {
                  await this.state.favourites.push({
                    userId: this.props.user.user._id,
                  });

                  // console.log("sdsdsdsdsdds", this.props.user.user._id,this.props.product, this.props.store.name)
                  axios
                    .post(
                      "https://lit-peak-13067.herokuapp.com/add/favourite",
                      {
                        userId: this.props.user.user._id,
                        product: this.props.product,
                        storeName: this.props.storeHeader.name,
                      }
                    )
                    .then((resp) => console.log("fav addedd", resp))
                    .catch((err) => console.log("sds", err));
                } else {
                  var that = this;
                  this.state.favourites = this.state.favourites.filter(
                    function (el) {
                      return el.userId !== that.props.user.user._id;
                      // console.log("asd",el.userId,that.props.user.user._id)
                    }
                  );

                  axios
                    .delete(
                      "https://lit-peak-13067.herokuapp.com/delete/favourite/" +
                        this.props.user.user._id +
                        "/" +
                        this.props.product._id
                    )
                    .then((resp) => console.log(resp))
                    .catch((err) => err);
                }

                axios
                  .put(
                    "https://lit-peak-13067.herokuapp.com/edit/favourites/" +
                      this.props.product._id,
                    {
                      favourites: this.state.favourites,
                    }
                  )
                  .then((resp) => {
                    this.setState((prevState) => {
                      return {
                        heart: !prevState.heart,
                      };
                    });
                  })
                  .catch((err) => console.log(err));
              }}
              style={{
                alignSelf: "flex-end",
                backgroundColor: "rgba(255, 255, 255,0.5)",
                margin: 10,
                padding: 7,
                borderRadius: 50,
              }}
            >
              {this.state.heart ? (
                <AntDesign color="#B50000" size={18} name="heart" />
              ) : (
                <AntDesign color="#B50000" size={18} name="hearto" />
              )}
            </TouchableOpacity>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.underCard}>
          <LatoText
            fontName="Lato-Regular"
            fonSiz={15}
            col="#5C5C5C"
            text={this.props.product.productName}
          ></LatoText>
          <View style={{ flex: 1, flexDirection: "row", paddingTop: 5 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={13}
              col="#2E2E2E"
              text={
                "$" +
                (
                  this.props.product.productPrice -
                  (this.props.product.productPrice *
                    this.props.product.productDiscount) /
                    100
                ).toFixed(2) +
                " / lb"
              }
            ></LatoText>
            <Text> </Text>
            {this.props.product.productPrice -
              (this.props.product.productPrice *
                this.props.product.productDiscount) /
                100 ==
            parseFloat(this.props.product.productPrice) ? null : (
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#89898C"
                lineThrough="line-through"
                text={"$" + this.props.product.productPrice + " / lb"}
              ></LatoText>
            )}
          </View>
          {this.props.product.productPrice -
            (this.props.product.productPrice *
              this.props.product.productDiscount) /
              100 ==
          parseFloat(this.props.product.productPrice) ? null : (
            <View>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                text={
                  "You will save " + this.props.product.productDiscount + "%"
                }
              ></LatoText>
            </View>
          )}
          <View style={{ marginTop: 20 }}>
            {this.state.cart ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={btnStyles.plusBtn}
                  onPress={() => this.handleChange(-1)}
                >
                  <AntDesign color="#B50000" size={18} name="minus" />
                </TouchableOpacity>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#5C5C5C"
                  text={this.state.qt}
                />
                <TouchableOpacity
                  style={btnStyles.plusBtn}
                  onPress={() => this.handleChange(1)}
                >
                  <AntDesign color="#B50000" size={18} name="plus" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  // var pCart=this.props.cart;
                  // pCart.push({
                  //   product: this.props.product,
                  //   quantity: this.state.qt
                  // })
                  // this.props.cartAsync(pCart)
                  // this.setState({cart: true})
                  if (this.props.cart.length === 0) {
                    var pCart = this.props.cart;
                    pCart.push({
                      product: this.props.product,
                      quantity: this.state.qt,
                    });
                    this.props.storeAsync({
                      name: this.props.storeHeader.name,
                      address: this.props.storeHeader.address,
                      id: this.props.storeHeader.id,
                      phone: this.props.storeHeader.phone,
                      sId: this.props.storeHeader.storeId,
                      oId: this.props.storeHeader.oId,
                    });
                    this.props.favStoreAsync(this.props.product.storeId);
                    this.props.cartAsync(pCart);
                    this.setState({ cart: true });
                  } else {
                    if (this.props.store.id === this.props.product.storeId) {
                      var pCart = this.props.cart;
                      pCart.push({
                        product: this.props.product,
                        quantity: this.state.qt,
                      });
                      this.props.storeAsync({
                        name: this.props.storeHeader.name,
                        address: this.props.storeHeader.address,
                        id: this.props.storeHeader.id,
                        phone: this.props.storeHeader.phone,
                        sId: this.props.storeHeader.storeId,
                        oId: this.props.storeHeader.oId,
                      });
                      this.props.favStoreAsync(this.props.product.storeId);
                      this.props.cartAsync(pCart);
                      this.setState({ cart: true });
                    } else {
                      this.setState(
                        { temp: this.props.product.storeId },
                        () => {
                          Alert.alert(
                            "Alert!",
                            "If you add a product from a new store, you will lose your cart from the previous store",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "OK",
                                onPress: () => {
                                  var pCart = [];
                                  pCart.push({
                                    product: this.props.product,
                                    quantity: this.state.qt,
                                  });
                                  this.props.storeAsync({
                                    name: this.props.storeHeader.name,
                                    address: this.props.storeHeader.address,
                                    id: this.props.storeHeader.id,
                                    phone: this.props.storeHeader.phone,
                                    sId: this.props.storeHeader.storeId,
                                    oId: this.props.storeHeader.oId,
                                  });
                                  this.props.favStoreAsync(
                                    this.props.product.storeId
                                  );
                                  this.props.cartAsync(pCart);
                                  this.setState({ cart: true });
                                },
                              },
                            ],
                            { cancelable: true }
                          );
                        }
                      );
                    }
                  }
                }}
                style={btnStyles.cartBtn}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="white"
                  text="Add To Cart"
                ></LatoText>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
  procards: {
    width: Dimensions.get("window").width / 2 - 20,
    height: 303,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    backgroundColor:'white'
  },
  proCardsImage: {
    height: 155,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  underCard: {
    backgroundColor: "white",
    height: 150,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  cartSize: state.CartSize.cartSizeData,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
  storeHeader: state.storeHeader.storeData1,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
      storeAsync,
      favStoreAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProCards);
