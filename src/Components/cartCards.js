import React, { PureComponent } from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "../Helpers/LatoText";
import { btnStyles } from "../styles/base";
import { bindActionCreators } from "redux";
import { cartAsync, cartSizeAsync } from "../store/actions";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import CartCardImage from "./CartCardImage";
class CartCards extends PureComponent {
  state = {
    heart: false,
    image: "",
    qt: 0,
    cart: [],
  };

  async componentWillMount() {
    await this.setState({
      cart: this.props.cart,
      qt: this.props.product.quantity,
    });
    var temp = this.state.cart[this.props.index];
    temp.price = (
      (this.props.product.product.productPrice -
        (this.props.product.product.productPrice *
          this.props.product.product.productDiscount) /
          100) *
      parseInt(this.state.qt)
    ).toFixed(2);
    this.state.cart[this.props.index] = temp;
    this.props.cartAsync(this.state.cart);
    // }
  }

  render() {
    // console.log("cart cards",this.props.cart)
    // console.log("image URLL",this.state.image, this.props.index)
    var cSize = 0;
    if (this.props.cart.length > 0) {
      for (var i = 0; i < this.props.cart.length; i++) {
        cSize = cSize + parseInt(this.props.cart[i].quantity);
      }
    } else {
      cSize = 0;
    }

    this.props.cartSizeAsync(cSize);
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 30,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity
            style={{ padding: 10, paddingLeft: 0 }}
            onPress={() => {
              this.props.handleRe(this.props.id);
              if (this.props.cart.length === 1) {
                this.props.cartSizeAsync(0);
              }
            }}
          >
            <Entypo name="circle-with-cross" size={24} color="#B50000" />
          </TouchableOpacity> */}
          <CartCardImage id={this.props.product.product.productID} />
          <LatoText
            fontName="Lato-Regular"
            fonSiz={15}
            col="#2E2E2E"
            text={this.props.product.product.productName.toUpperCase()}
          />
        </View>
        <View
          style={{ alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <View
            style={{
              flexDirection: "row",
              // alignItems: "center",
              justifyContent: "space-between",
              alignContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={[btnStyles.plusBtn, { paddingTop: 0 }]}
              onPress={() => {
                // alert(JSON.stringify(this.state.cart[this.props.index]));
                if (this.state.qt - 1 > 0) {
                  this.setState({ qt: this.state.qt - 1 });
                  var temp = this.state.cart[this.props.index];
                  temp.price = (
                    (this.props.product.product.productPrice -
                      (this.props.product.product.productPrice *
                        this.props.product.product.productDiscount) /
                        100) *
                    parseInt(this.state.qt + 1)
                  ).toFixed(2);
                  temp.quantity = parseInt(this.state.qt - 1);
                  this.state.cart[this.props.index] = temp;
                  this.props.cartAsync(this.state.cart);
                } else {
                  // alert(this.props.id)
                  this.props.handleRe(this.props.id);
                  if (this.props.cart.length === 1) {
                    this.props.cartSizeAsync(0);
                  }
                }
                //   this.handleChange(-1)
                // if (this.state.qt - 1 >= 1) {
                //   this.setState({ qt: this.state.qt - 1 });
                //   var temp = this.state.cart[this.props.index];
                //   temp.price = (
                //     (this.props.product.product.productPrice -
                //       (this.props.product.product.productPrice *
                //         this.props.product.product.productDiscount) /
                //         100) *
                //     parseInt(this.state.qt - 1)
                //   ).toFixed(2);
                //   temp.quantity = parseInt(this.state.qt - 1);
                //   this.state.cart[this.props.index] = temp;
                //   this.props.cartAsync(this.state.cart);
                // } else {
                //   this.props.handleRe(this.props.id);
                //   if (this.props.cart.length === 1) {
                //     this.props.cartSizeAsync(0);
                //   }
                // }
              }}
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
              style={[btnStyles.plusBtn, { paddingTop: 0 }]}
              onPress={() => {
                //   this.handleChange(1)
                this.setState({ qt: this.state.qt + 1 });
                var temp = this.state.cart[this.props.index];
                temp.price = (
                  (this.props.product.product.productPrice -
                    (this.props.product.product.productPrice *
                      this.props.product.product.productDiscount) /
                      100) *
                  parseInt(this.state.qt + 1)
                ).toFixed(2);
                temp.quantity = parseInt(this.state.qt + 1);
                this.state.cart[this.props.index] = temp;
                this.props.cartAsync(this.state.cart);
              }}
            >
              <AntDesign color="#B50000" size={18} name="plus" />
            </TouchableOpacity>
          </View>

          <View style={{ marginRight: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={
                !this.props.isFeatured
                  ? `$${(
                      (this.props.product.product.productPrice -
                        (this.props.product.product.productPrice *
                          this.props.product.product.productDiscount) /
                          100) *
                      parseInt(this.state.qt)
                    ).toFixed(2)}`
                  : "$" + this.props.product.product.productPrice
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
// export default CartCards;
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
  error: state.Cart.cartError,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CartCards);
