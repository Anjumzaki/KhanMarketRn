import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  LinearGradient,
  TouchableOpacity
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
import CartCard from '../Components/cartCards.js'

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1
    };
  }

  _onLayoutDidChange = e => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    console.log(preNum);
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }
  render() {
    console.log("Cart props", this.props)
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center"
            }}
          >
            <Image
              style={{ width: 44, height: 44, marginRight: 10 }}
              source={require("../../assets/new.png")}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text="KHAN MARKET"
            ></LatoText>
          </View>
          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              justifyContent: "space-between"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  width: 53,
                  height: 61,
                  marginRight: 10,
                  borderRadius: 10
                }}
                source={require("../../assets/products/beef1.png")}
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#2E2E2E"
                text="RIB EYE"
              />
            </View>
            <View style={{alignItems:'flex-end',justifyContent:'space-between'}}>
              <View
                style={{
                  flexDirection: "row",
                  // alignItems: "center",
                  justifyContent: "space-between",
                  alignContent: "flex-end"
                }}
              >
                <TouchableOpacity
                  style={[btnStyles.plusBtn,{paddingTop:0}]}
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
                  style={[btnStyles.plusBtn,{paddingTop:0}]}
                  onPress={() => this.handleChange(1)}
                >
                  <AntDesign color="#B50000" size={18} name="plus" />
                </TouchableOpacity>
              </View>
              <View style={{marginRight:20}}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#5C5C5C"
                  text={"$4.95"}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              justifyContent: "space-between"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={25}
                col="#2E2E2E"
                text="Subtotal"
              />
            </View>
            <View style={{alignItems:'flex-end',justifyContent:'space-between'}}>
              <View style={{marginRight:20}}>
                <LatoText
                  fontName="Lato-Bold"
                  fonSiz={25}
                  col="#5C5C5C"
                  text={"$4.95"}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={bottomTab.cartSheet}>
          <TouchableOpacity
            onPress={() => this.props.navigation.push('Checkout1')}
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
            onPress={() => this.props.navigation.push('Checkout1')}
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
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  imgCon: {
    width: Dimensions.get("window").width,
    height: 250
  },
  topRight: {
    alignSelf: "flex-end"
  },
  wrapTop: {
    alignSelf: "flex-end",

    marginTop: 30,
    backgroundColor: "#7cba80",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  bottomText: {
    height: 200,
    flexDirection: "row"
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  }
});

const mapStateToProps = state => ({
  cart: state.Cart.cartData, 
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
      {
          cartAsync
      },
      dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);