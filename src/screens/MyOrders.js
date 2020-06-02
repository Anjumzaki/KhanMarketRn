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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import OrderCards from "../Helpers/OrderCards";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync } from "../store/actions";
import { connect } from "react-redux";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const { height } = 300;

class MyOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      myOrders: [],
      loading: true,
      activeCollapsed: false,
      pastCollapsed: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      axios
        .get(
          "https://lit-peak-13067.herokuapp.com/get/my/orders/" +
            this.props.user.user._id
        )
        .then((resp) => this.setState({ myOrders: resp.data, loading: false }))
        .catch((err) => console.log(err));
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    var active = [];
    var past = [];

    for (var i = 0; i < this.state.myOrders.length; i++) {
      if (
        (this.state.myOrders[i].isPicked === true &&
          this.state.myOrders[i].isAccepted === true) ||
        this.state.myOrders[i].isRejected === true
      ) {
        past.push(this.state.myOrders[i]);
      } else {
        active.push(this.state.myOrders[i]);
      }
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          {active.length > 0 ? (
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  paddingLeft: 5,
                  paddingTop: 20,
                  paddingBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={20}
                  col="#5C5C5C"
                  text={"Active (" + active.length + ")"}
                />
                {this.state.activeCollapsed ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        activeCollapsed: false,
                      })
                    }
                  >
                    <Ionicons
                      style={{ paddingHorizontal: 20 }}
                      name="ios-arrow-down"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        activeCollapsed: true,
                      })
                    }
                  >
                    <Ionicons
                      style={{ paddingHorizontal: 20 }}
                      name="ios-arrow-up"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Collapsible collapsed={this.state.activeCollapsed}>
                {active
                  .slice(0)
                  .reverse()
                  .map((item, ind) => (
                    <OrderCards
                      navigation={this.props.navigation}
                      key={ind}
                      order={item}
                      type="active"

                    />
                  ))}
              </Collapsible>
            </View>
          ) : this.state.loading ? (
            <ActivityIndicator
              style={{ marginTop: 100 }}
              size="large"
              color="black"
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 100 }}>
              No recent orders
            </Text>
          )}

          {past.length > 0 ? (
            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  paddingLeft: 5,
                  paddingTop: 20,
                  paddingBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={20}
                  col="#5C5C5C"
                  text={"Past (" + past.length + ")"}
                />
                {this.state.activeCollapsed ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        pastCollapsed: false,
                      })
                    }
                  >
                    <Ionicons
                      style={{ paddingHorizontal: 20 }}
                      name="ios-arrow-down"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        pastCollapsed: true,
                      })
                    }
                  >
                    <Ionicons
                      style={{ paddingHorizontal: 20 }}
                      name="ios-arrow-up"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Collapsible collapsed={this.state.pastCollapsed}>
                {past
                  .slice(0)
                  .reverse()
                  .map((item, ind) => (
                    <OrderCards
                      navigation={this.props.navigation}
                      key={ind}
                      order={item}
                      type="past"
                    />
                  ))}
              </Collapsible>
            </View>
          ) : null}
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
  error: state.Cart.cartError,
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
