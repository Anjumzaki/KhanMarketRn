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
  Alert,
} from "react-native";
import Toast from "react-native-simple-toast";
import Carousel from "react-native-looped-carousel";
import { AntDesign } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import CourselImage from "../Components/CourselImage";
import { btnStyles, bottomTab } from "../styles/base";
import { Row } from "native-base";
const { width } = Dimensions.get("window");
const { height } = 300;
import firebase from "firebase";
import { bindActionCreators } from "redux";
import {
  cartAsync,
  cartSizeAsync,
  storeAsync,
  favStoreAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";

class ProductDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      favourites: [],
      buttonDisable: false,
    };
  }

  componentDidMount() {
    // alert(this.props.route.params.favProducts);
    const ref = firebase
      .storage()
      .ref(
        "/product_images/" +
        this.props.route.params.product.productID +
        "_1.jpg"
      );
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));

    if (this.props.route.params.favProducts === undefined) {
      this.setState({ favourites: [] });
    } else {
      for (var i = 0; i < this.props.route.params.favProducts.length; i++) {
        if (
          this.props.route.params.favProducts[i].itemID ===
          this.props.route.params.product.itemID
        ) {
          this.setState({
            heart: true,
            currentFavID: this.props.route.params.favProducts[i].favID,
          });
        }
      }
      this.setState({ favourites: this.props.route.params.favProducts });
    }

    var pCart = this.props.cart;
    var inCart = false;
    var inCartIndex = "";
    for (var i = 0; i < pCart.length; i++) {
      if (
        pCart[i].product.productID === this.props.route.params.product.productID
      ) {
        inCart = true;
        this.setState({
          buttonDisable: true,
        });
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

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };

  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum > 0) {
      this.setState({ qt: preNum });
      var pCart = this.props.cart;
      var that = this;
      pCart.map(function (pro, ind) {
        if (
          pro.product.productID === that.props.route.params.product.productID
        ) {
          pro.quantity = that.state.qt + num;
        }
      });
      this.props.cartAsync(pCart);
    } else {
      var sp = this.props.route.params.product.productID;
      var temp = this.props.cart;
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].product.productID === sp) {
          if (i > -1) {
            temp.splice(i, 1);
          }
        }
      }
      this.props.cartAsync(temp);
      this.setState({ buttonDisable: false });
    }
  }
  render() {
    var product = this.props.route.params.product;
    // alert(JSON.stringify(product))
    var noOfImg = product.noOfImage;
    noOfImg = parseInt(noOfImg);
    var temp = [];
    for (var i = 0; i < noOfImg; i++) {
      temp.push(i);
    }
    var abc = [1, 2, 3];

    var cSize = 0;

    for (var i = 0; i < this.props.cart.length; i++) {
      cSize = cSize + parseInt(this.props.cart[i].quantity);
    }

    this.props.cartSizeAsync(cSize);

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            onLayout={this._onLayoutDidChange}
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Text>asd</Text> */}
            <Carousel
              delay={6000}
              style={{
                width: Dimensions.get("window").width - 40,
                height: 250,
                marginTop: 20,
                borderRadius: 10,
              }}
              autoplay={true}
              bullets
              // onAnimateNextPage={p => console.log(p)}
              bulletStyle={{
                padding: 0,
                margin: 3,
                marginTop: 80,
                borderColor: "#89898C",
              }}
              chosenBulletStyle={{
                padding: 0,
                margin: 3,
                marginTop: 80,
                backgroundColor: "#89898C",
              }}
            >
              {/* <> */}
              {temp.map((item, index) => (
                // <View style={{ borderRadius: 10, overflow: "hidden" }}>

                <CourselImage id={product.productID} index={item + 1} />
                // </View>
              ))}
              {/* </> */}
            </Carousel>
          </View>

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
                      userID: this.props.route.params.userID,
                      itemID: this.props.route.params.itemID,
                      // storeName: this.props.storeHeader.name,
                    },
                    {
                      headers: {
                        authorization: this.props.route.params.token,
                      },
                    }
                  )
                  .then((resp) =>
                    this.setState({ heart: true }, console.log(resp))
                  )
                  .catch((err) => console.log(err));
              } else {
                var that = this;
                this.state.favourites = this.state.favourites.filter(function (
                  el
                ) {
                  return el.itemID !== that.props.route.params.product.itemID;
                  // console.log("asd",el.userId,that.props.user.user._id)
                });
                axios
                  .delete(
                    "https://secret-cove-59835.herokuapp.com/v1/ref_prod_fav/" +
                    this.props.route.params.currentFavID,
                    {
                      headers: {
                        authorization: this.props.route.params.token,
                      },
                    }
                  )
                  .then((resp) =>
                    this.setState({ heart: false }, console.log(resp))
                  )
                  .catch((err) => err);
              }
            }}
            style={{
              alignSelf: "flex-end",
              backgroundColor: "rgb(255, 255, 255)",
              margin: 10,
              padding: 7,
              borderRadius: 50,
              position: "relative",
              bottom: 25,
              right: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            {this.state.heart ? (
              <AntDesign
                style={styles.favIcon}
                color="#B50000"
                size={18}
                name="heart"
              />
            ) : (
                <AntDesign
                  style={styles.favIcon}
                  color="#B50000"
                  size={18}
                  name="hearto"
                />
              )}
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={25}
              col="#5C5C5C"
              text={product.productName}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 22,
                  alignItems: "center",
                }}
              >
                <LatoText
                  fontName="Lato-Bold"
                  fonSiz={20}
                  col="#5C5C5C"
                  text={` $  ${parseFloat(
                    product.productPrice -
                    (product.productPrice * product.productDiscount) / 100
                  ).toFixed(2)} / lb `}
                />
                {parseFloat(
                  product.productPrice -
                  (product.productPrice * product.productDiscount) / 100
                ) == product.productPrice ? null : (
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      lineThrough="line-through"
                      col="#89898C"
                      text={`$${product.productPrice} / lb `}
                    />
                  )}
              </View>
              {parseFloat(
                product.productPrice -
                (product.productPrice * product.productDiscount) / 100
              ) == product.productPrice ? null : (
                  <View style={{ marginTop: 22 }}>
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#B50000"
                      text={` You will save ${product.productDiscount}% `}
                    />
                  </View>
                )}
            </View>
            <View style={{ marginTop: 22 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={product.productDescription}
              />
            </View>
          </View>
          <Expandable product={product} />
        </ScrollView>
        <View style={[bottomTab.cartSheet, { flexDirection: 'row' }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "50%",
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
          <TouchableOpacity
            disabled={this.state.buttonDisable}
            onPress={() => {
              if (this.props.cart.length === 0) {
                var pCart = this.props.cart;
                pCart.push({
                  product: this.props.route.params.product,
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
                  this.props.route.params.product.storeID
                );
                this.props.cartAsync(pCart);
                this.setState({ cart: true, buttonDisable: true });
              } else {
                if (
                  this.props.store.id ===
                  this.props.route.params.product.storeID
                ) {
                  var pCart = this.props.cart;
                  // var inCart = false
                  // var inCartIndex = ""
                  // for(var i=0; i<pCart.length; i++){
                  //   if(pCart[i].product._id === this.props.route.params.product._id){
                  //     inCart =true
                  //     inCartIndex=i
                  //     break
                  //   }
                  // }

                  // console.log("inCarttttttttttt",inCart, inCartIndex)
                  // if(inCart){
                  //   pCart[inCartIndex ].quantity = pCart[inCartIndex ].quantity+1
                  //   // pCart.push({
                  //   //   product: this.props.route.params.product,
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
                  //   this.props.favStoreAsync(this.props.route.params.product.storeId);
                  //   this.props.cartAsync(pCart);
                  //   this.setState({ cart: true });
                  // }else{
                  pCart.push({
                    product: this.props.route.params.product,
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
                    this.props.route.params.product.storeId
                  );
                  this.props.cartAsync(pCart);
                  this.setState({ cart: true, buttonDisable: true });
                  // }
                } else {
                  this.setState(
                    { temp: this.props.route.params.product.storeId },
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
                                product: this.props.route.params.product,
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
                                this.props.route.params.product.storeId
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
            style={[
              this.state.buttonDisable ? btnStyles.cartBtn1 : btnStyles.cartBtn,
              { width: "40%" },
            ]}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="Add To Cart"
            ></LatoText>
          </TouchableOpacity>
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
  user: state.user.user,
  store: state.Store.storeData,
  cartSize: state.CartSize.cartSizeData,
  storeHeader: state.storeHeader.storeData1,
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
