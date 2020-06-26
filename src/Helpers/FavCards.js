import React from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Button,
  Image,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "./LatoText";
import { btnStyles } from "../styles/base";
import { bindActionCreators } from "redux";
import {
  cartAsync,
  cartSizeAsync,
  favStoreAsync,
  storeAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "react-native-modalbox";

class FavCards extends React.Component {
  state = {
    heart: true,
    image: "",
    qt: 1,
    favourites: [],
    currentStore: "",
    temp: "",
  };

  componentDidMount() {
    const ref = firebase

      .storage()
      .ref("/product_images/" + this.props.product.product._id + "_1.jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));

    if (this.props.product.product.favourites === undefined) {
      this.setState({ favourites: [] });
    } else {
      this.setState({ favourites: this.props.product.product.favourites });
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
      if (pro.product.productName === that.props.product.product.productName) {
        pro.quantity = that.state.qt + num;
      }
    });

    this.props.cartAsync(pCart);
  }
  render() {
    var cSize = 0;
    for (var i = 0; i < this.props.cart.length; i++) {
      cSize = cSize + parseFloat(this.props.cart[i].quantity);
    }

    this.props.cartSizeAsync(cSize);
    return (
      <View style={styles.procards}>
        <View style={styles.wrapCards}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ProductDetails", {
                product: this.props.product.product,
              })
            }
          >
            <Image
              style={styles.proCardsImage}
              source={{ uri: this.state.image }}
            />
          </TouchableOpacity>
          <View style={styles.underCard}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#5C5C5C"
                text={this.props.product.product.productName}
              ></LatoText>

              {/* <TouchableOpacity
                onPress={async () => {
                  if (this.state.heart === false) {
                    await this.state.favourites.push({
                      userId: this.props.user.user._id,
                    });

                    axios
                      .post(
                        "https://lit-peak-13067.herokuapp.com/add/favourite",
                        {
                          userId: this.props.user.user._id,
                          product: this.props.product,
                          storeName: this.props.store.name,
                        }
                      )
                      .then((resp) => console.log(resp))
                      .catch((err) => console.log(err));
                  } else {
                    var that = this;
                    this.state.favourites = this.state.favourites.filter(
                      function (el) {
                        return el.userId !== that.props.user.user._id;
                      }
                    );

                    axios
                      .delete(
                        "https://lit-peak-13067.herokuapp.com/delete/favourite/" +
                          this.props.user.user._id +
                          "/" +
                          this.props.product.product._id
                      )
                      .then((resp) => console.log("asd", resp))
                      .catch((err) => err);
                  }

                  axios
                    .put(
                      "https://lit-peak-13067.herokuapp.com/edit/favourites/" +
                        this.props.product.product._id,
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
              >
                {this.props.product.favItem ? (
                  <AntDesign color="#B50000" size={18} name="heart" />
                ) : (
                  <AntDesign color="#B50000" size={18} name="hearto" />
                )}
              </TouchableOpacity> */}
              {this.props.product.favItem ? (
                <TouchableOpacity
                  onPress={()=>this.props.handleFav(this.props.ind,this.props.product.product._id)}
                >
                  <AntDesign color="#B50000" size={18} name="heart" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <AntDesign color="#B50000" size={18} name="hearto" />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1, flexDirection: "row", paddingTop: 5 }}>
              <View style={{ marginRight: 5 }}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={13}
                  col="#2E2E2E"
                  text={
                    "$" +
                    (
                      parseFloat(this.props.product.product.price) -
                      (parseFloat(this.props.product.product.price) *
                        parseFloat(this.props.product.product.discount)) /
                        100
                    ).toFixed(2) +
                    " / lb"
                  }
                ></LatoText>
              </View>
              <View style={{ marginLeft: 5 }}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={13}
                  col="#89898C"
                  lineThrough="line-through"
                  text={"$" + this.props.product.product.price + " / lb"}
                ></LatoText>
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                text={
                  "You will save " + this.props.product.product.discount + "%"
                }
              ></LatoText>
            </View>
            <View>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#2E2E2E"
                text={this.props.product.storeName}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              {this.props.myCart ? (
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
                        product: this.props.product.product,
                        quantity: this.state.qt,
                      });
                      this.props.favStoreAsync(
                        this.props.product.product.storeId
                      );
                      this.props.cartAsync(pCart);
                      this.setState({ cart: true });

                      if (this.props.store === "") {
                        axios
                          .get(
                            "https://lit-peak-13067.herokuapp.com/get/store/" +
                              this.props.product.product.storeId
                          )
                          .then((resp) => {
                            this.props.storeAsync({
                              name: resp.data.storeName,
                              address: resp.data.storeAddress,
                              id: resp.data._id,
                              phone: resp.data.phoneNumber,
                              sId: resp.data.storeId,
                              oId: resp.data.orderNum,
                            });
                          });
                      }
                    } else {
                      if (
                        this.props.favStore ===
                        this.props.product.product.storeId
                      ) {
                        var pCart = this.props.cart;
                        pCart.push({
                          product: this.props.product.product,
                          quantity: this.state.qt,
                        });
                        this.props.favStoreAsync(
                          this.props.product.product.storeId
                        );
                        this.props.cartAsync(pCart);
                        this.setState({ cart: true });
                      } else {
                        this.setState(
                          { temp: this.props.product.product.storeId },
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
                                      product: this.props.product.product,
                                      quantity: this.state.qt,
                                    });
                                    this.props.favStoreAsync(
                                      this.props.product.product.storeId
                                    );
                                    this.props.cartAsync(pCart);
                                    this.setState({ cart: true });

                                    axios
                                      .get(
                                        "https://lit-peak-13067.herokuapp.com/get/store/" +
                                          this.state.temp
                                      )
                                      .then((resp) => {
                                        this.props.storeAsync({
                                          name: resp.data.storeName,
                                          address: resp.data.storeAddress,
                                          id: resp.data._id,
                                          phone: resp.data.phoneNumber,
                                          sId: resp.data.storeId,
                                          oId: resp.data.orderNum,
                                        });
                                        this.refs.modal3.close();
                                      });
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

        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          isDisabled={this.state.isDisabled}
        >
          <Text>
            If you add a product from a new store, you will lose your cart from
            the previous store
          </Text>
          <View>
            <Button
              onPress={() => this.refs.modal3.close()}
              title="Cancel"
            ></Button>
            <Button
              onPress={() => {
                // this.props.cartAsync([])
              }}
              title="Okay"
            ></Button>
          </View>
        </Modal>
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
    width: Dimensions.get("window").width - 20,
    marginLeft: 10,
    height: Dimensions.get("window").width / 2,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 10,
  },
  proCardsImage: {
    width: Dimensions.get("window").width / 3,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: Dimensions.get("window").width / 2,
  },
  underCard: {
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  wrapCards: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").width / 2,
    flexDirection: "row",
  },
  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modal3: {
    height: 230,
    width: Dimensions.get("window").width - 100,
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  cartSize: state.CartSize.cartSizeData,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
  favStore: state.favStore.favStoreData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
      favStoreAsync,
      storeAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FavCards);
