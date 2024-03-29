import React from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
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
    currentFavID: "",
  };

  componentDidMount() {
    // alert(this.props.favProducts);
    const ref = firebase
      .storage()
      .ref("/product_images/" + this.props.product.productID + "_1.jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));

    if (this.props.favProducts === undefined) {
      this.setState({ favourites: [] });
    } else {
      for (var i = 0; i < this.props.favProducts.length; i++) {
        if (this.props.favProducts[i].itemID === this.props.product.itemID) {
          this.setState({
            heart: true,
            currentFavID: this.props.favProducts[i].favID,
          });
        }
      }
      this.setState({ favourites: this.props.favProducts });
    }

    var pCart = this.props.cart;
    var inCart = false;
    var inCartIndex = "";
    for (var i = 0; i < pCart.length; i++) {
      if (pCart[i].product.itemID === this.props.product.itemID) {
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
    if (preNum > 0) {
      this.setState({ qt: preNum });
      var pCart = this.props.cart;
      var that = this;
      pCart.map(function (pro, ind) {
        if (pro.product.productName === that.props.product.productName) {
          pro.quantity = that.state.qt + num;
        }
      });

      this.props.cartAsync(pCart);
    } else {
      this.setState({ cart: false });
      var sp = this.props.product.productID;
      var temp = this.props.cart;
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].product.productID === sp) {
          if (i > -1) {
            temp.splice(i, 1);
          }
        }
      }

      this.props.cartAsync(temp);
    }
  }
  render() {
    var cSize = 0;
    for (var i = 0; i < this.props.cart.length; i++) {
      cSize = cSize + parseInt(this.props.cart[i].quantity);
    }

    this.props.cartSizeAsync(cSize);
    return (
      <View style={styles.procards}>
        <ImageBackground
          style={styles.proCardsImage}
          source={{ uri: this.state.image }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ height: "100%" }}
              onPress={() =>
                this.props.navigation.navigate("ProductDetails", {
                  product: this.props.product,
                  favProducts: this.props.favProducts,
                  userID: this.props.user.user.userID
                    ? this.props.user.user.userID
                    : this.props.user.user.userId,
                  itemID: this.props.product.itemID,
                  token: this.props.user.token,
                  currentFavID: this.state.currentFavID,
                })
              }
            >
              <Text> </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={async () => {
                if (this.state.heart === false) {
                  await this.state.favourites.push({
                    userId: this.props.prodcuts,
                  });

                  axios
                    .post(
                      "https://secret-cove-59835.herokuapp.com/v1/ref_prod_fav",
                      {
                        userID: this.props.user.user.userID
                          ? this.props.user.user.userID
                          : this.props.user.user.userId,
                        itemID: this.props.product.itemID,
                        // storeName: this.props.storeHeader.name,
                      },
                      {
                        headers: {
                          authorization: this.props.user.token,
                        },
                      }
                    )
                    .then((resp) => this.setState({ heart: true }))
                    .catch((err) => console.log(err));
                } else {
                  var that = this;
                  this.state.favourites = this.state.favourites.filter(
                    function (el) {
                      return el.itemID !== that.props.product.itemID;
                      // console.log("asd",el.userId,that.props.user.user._id)
                    }
                  );
                  axios
                    .delete(
                      "https://secret-cove-59835.herokuapp.com/v1/ref_prod_fav/" +
                        this.state.currentFavID,
                      {
                        headers: {
                          authorization: this.props.user.token,
                        },
                      }
                    )
                    .then((resp) => this.setState({ heart: false }))
                    .catch((err) => err);
                }
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
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ height: "100%" }}
                onPress={() =>
                  this.props.navigation.navigate("ProductDetails", {
                    product: this.props.product,
                    favProducts: this.props.favProducts,
                    userID: this.props.user.user.userID
                      ? this.props.user.user.userID
                      : this.props.user.user.userId,
                    itemID: this.props.product.itemID,
                    token: this.props.user.token,
                    currentFavID: this.state.currentFavID,
                  })
                }
              >
                <Text> </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.underCard}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ProductDetails", {
                product: this.props.product,
                favProducts: this.props.favProducts,
                userID: this.props.user.user.userID
                  ? this.props.user.user.userID
                  : this.props.user.user.userId,
                itemID: this.props.product.itemID,
                token: this.props.user.token,
                currentFavID: this.state.currentFavID,
              })
            }
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={15}
              col="#5C5C5C"
              text={this.props.product.productName.substring(0, 15)}
            ></LatoText>
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: "row", paddingTop: 5 }}>
            <View style={{ marginRight: 5 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
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
            </View>
            {this.props.product.productPrice -
              (this.props.product.productPrice *
                this.props.product.productDiscount) /
                100 ==
            parseFloat(this.props.product.productPrice) ? null : (
              <View style={{ marginLeft: 5 }}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  lineThrough="line-through"
                  col="#89898C"
                  text={
                    "$" +
                    parseFloat(this.props.product.productPrice).toFixed(2) +
                    " / lb"
                  }
                ></LatoText>
              </View>
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
                      storeTax: this.props.storeHeader.storeTax,
                    });
                    this.props.favStoreAsync(this.props.product.storeID);
                    this.props.cartAsync(pCart);
                    this.setState({ cart: true });
                  } else {
                    if (this.props.store.id === this.props.product.storeID) {
                      var pCart = this.props.cart;
                      // var inCart = false
                      // var inCartIndex = ""
                      // for(var i=0; i<pCart.length; i++){
                      //   if(pCart[i].product._id === this.props.product._id){
                      //     inCart =true
                      //     inCartIndex=i
                      //     break
                      //   }
                      // }

                      // console.log("inCarttttttttttt",inCart, inCartIndex)
                      // if(inCart){
                      //   pCart[inCartIndex ].quantity = pCart[inCartIndex ].quantity+1
                      //   // pCart.push({
                      //   //   product: this.props.product,
                      //   //   quantity: this.state.qt,
                      //   // });
                      //   this.props.storeAsync({
                      //     name: this.props.storeHeader.name,
                      //     address: this.props.storeHeader.address,
                      //     id: this.props.storeHeader.id,
                      //     phone: this.props.storeHeader.phone,
                      //     sId: this.props.storeHeader.storeId,
                      //     oId: this.props.storeHeader.oId,
                      //   });
                      //   this.props.favStoreAsync(this.props.product.storeId);
                      //   this.props.cartAsync(pCart);
                      //   this.setState({ cart: true });
                      // }else{
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
                        storeTax: this.props.storeHeader.storeTax,
                      });
                      this.props.favStoreAsync(this.props.product.storeId);
                      this.props.cartAsync(pCart);
                      this.setState({ cart: true });
                      // }
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
                                    storeTax: this.props.storeHeader.storeTax,
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
    width: 217,
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
  },
  proCardsImage: {
    width: 217,
    height: 155,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
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
