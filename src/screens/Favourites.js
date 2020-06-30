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
  ActivityIndicator,
  Alert,
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import FavCards from "../Helpers/FavCards";
import { bindActionCreators } from "redux";
import { cartAsync, cartSizeAsync, favStoreAsync,storeAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import { NavigationEvents } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const { height } = 300;

class Favourites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      favourites: [],
      loading: true,
      imageL: false,
      temp: "",
    };
  }
  getData = () => {
    // alert(JSON.stringify(this.props.cart[0]))
    var that = this;
    this.setState(
      {
        favourites: [],
        loading: true,
      },
      () =>
        axios
          .get(
            "https://lit-peak-13067.herokuapp.com/get/all/favourites/" +
              this.props.user.user._id
          )
          .then((resp) => {
            var items = resp.data;
            for (var i = 0; i < items.length; i++) {
              items[i].favItem = true;
              for (var j = 0; j < that.props.cart.length; j++) {
                console.log(items[i]._id);
                if (that.props.cart[j].product._id == items[i].product._id) {
                  items[i].carted = true;
                }
              }
            }
            this.setState({
              favourites: items,
              loading: false,
            });
          })
          .catch((err) => console.log(err))
    );
  };
  componentDidMount() {
    this.getData();
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getData();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  handleFav = async (id, _id) => {
    var items = this.state.favourites;
    var items1 = this.state.favourites;

    var that = this;
    this.setState(
      {
        imageL: true,
        loading: true,
        // favourites: [],
      },
      () => {
        items.splice(id, 1);
        axios
          .delete(
            "https://lit-peak-13067.herokuapp.com/delete/favourite/" +
              this.props.user.user._id +
              "/" +
              _id
          )
          .then((resp) =>
            this.setState({
              favourites: items,
              imageL: false,
              loading: false,
            })
          )
          .catch((err) => err);
        items1 = items1.filter(function (el) {
          return el.userId !== that.props.user.user._id;
        });
        axios
          .put("https://lit-peak-13067.herokuapp.com/edit/favourites/" + _id, {
            favourites: items1,
          })
          .then((resp) => {})
          .catch((err) => console.log(err));
      }
    );
  };

  handleCart = (product, qt, ind) => {
    // alert(this.props.favStore === product.storeId)
    // alert(product.storeId)
    // var items = this.state.favourites;
    // items[ind].carted = true;
    // this.setState(
    //   {
    //     favourites: items,
    //   },
    //   () => alert(JSON.stringify(this.state.favourites))
    // );

    var items = this.state.favourites;
    this.setState(
      {
        imageL: true,
        favourites: [],
      },
      () => {
        if (this.props.cart.length === 0) {
          var pCart = this.props.cart;
          pCart.push({
            product: product,
            quantity: qt,
          });
          this.props.favStoreAsync(product.storeId);
          this.props.cartAsync(pCart);
          items[ind].carted = true;
          this.setState({
            favourites: items,
            imageL: false,
          });
          // if (this.props.store === "") {
            axios
              .get(
                "https://lit-peak-13067.herokuapp.com/get/store/" +
                  product.storeId
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
          // }
        } else {
          if (this.props.favStore === product.storeId) {
            var pCart = this.props.cart;
            pCart.push({
              product: product,
              quantity: qt,
            });
            this.props.favStoreAsync(product.storeId);
            this.props.cartAsync(pCart);
            items[ind].carted = true;
            this.setState({
              favourites: items,
              imageL: false,
            });
          } else {
            this.setState({ temp: product.storeId }, () => {
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
                      this.getData()
                      var pCart = [];
                      pCart.push({
                        product: product,
                        quantity: qt,
                      });
                      this.props.favStoreAsync(product.storeId);
                      this.props.cartAsync(pCart);
                      items[ind].carted = true;
                      this.setState(
                        {
                          favourites: items,
                          imageL: false,
                        },
                        () =>
                        // alert(this.state.temp)
                          axios
                            .get(
                              "https://lit-peak-13067.herokuapp.com/get/store/" +
                                this.state.temp
                            )
                            .then((resp) => {
                              console.log(resp.data)
                              this.props.storeAsync({
                                name: resp.data.storeName,
                                address: resp.data.storeAddress,
                                id: resp.data._id,
                                phone: resp.data.phoneNumber,
                                sId: resp.data.storeId,
                                oId: resp.data.orderNum,
                              });
                            })
                      );
                    },
                  },
                ],
                { cancelable: true }
              );
            });
          }
        }
      }
    );
  };
  render() {
    const myfavs = this.state.favourites;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white", paddingTop: 20 }}>
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {!this.state.imageL ? (
              <>
                {myfavs.length > 0 ? (
                  myfavs.map((item, ind) => (
                    <FavCards
                      navigation={this.props.navigation}
                      key={ind}
                      ind={ind}
                      product={item}
                      handleFav={this.handleFav}
                      handleCart={this.handleCart}
                    />
                  ))
                ) : this.state.loading ? (
                  <ActivityIndicator
                    style={{ marginTop: 100 }}
                    size="large"
                    color="black"
                  />
                ) : (
                  <Text style={{ textAlign: "center", marginTop: 100 }}>
                    No favourite items
                  </Text>
                )}
              </>
            ) : (
              <ActivityIndicator
                style={{ marginTop: 100 }}
                size="large"
                color="black"
              />
            )}
          </View>
        </ScrollView>
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
      storeAsync
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);
