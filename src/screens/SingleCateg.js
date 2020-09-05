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
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import ProcardsSmall from "../Helpers/ProcardsSmall";
import { bindActionCreators } from "redux";
import { filterAsync, searchAsync, search1Async } from "../store/actions";
import { connect } from "react-redux";

const { width } = Dimensions.get("window");
const { height } = 300;

class SingleCateg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
    };
  }
  componentDidMount() {
    // alert(JSON.stringify(this.props.route.params.favProducts))
    // alert(this.props.filter);

    this.props.searchAsync("");
    this.props.search1Async("");

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.props.searchAsync("");
      this.props.search1Async("");
      this.setState({ loading: true }, () => this.setState({ loading: false }));
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
    this.props.searchAsync("");
    this.props.search1Async("");
  }

  render() {
    var searchedProducts = [];
    var key1 = this.props.searchInput;
    if (this.props.searchInput) {
      let totalProducts = [...this.props.route.params.products];
      searchedProducts = totalProducts.filter(function (product) {
        return product.productName
          ? product.productName.toLowerCase().includes(key1.toLowerCase())
          : null;
      });
    }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {this.state.loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <ScrollView style={{ backgroundColor: "white" }}>
            {this.props.searchInput ? (
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {this.props.filtered === "Asc"
                  ? searchedProducts.map((item, ind) => (
                      <ProcardsSmall
                        navigation={this.props.navigation}
                        key={1}
                        product={item}
                        filter1={this.props.searchInput}
                        favProducts={this.props.route.params.favProducts}
                      />
                    ))
                  : searchedProducts
                      .slice(0)
                      .reverse()
                      .map((item, ind) => (
                        <ProcardsSmall
                          navigation={this.props.navigation}
                          key={1}
                          product={item}
                          filter1={this.props.filtered}
                          favProducts={this.props.route.params.favProducts}
                        />
                      ))}
              </View>
            ) : (
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {this.props.filtered === "Dec"
                  ? this.props.route.params.products.map((item, ind) => (
                      <ProcardsSmall
                        navigation={this.props.navigation}
                        key={1}
                        product={item}
                        filter1={this.props.searchInput}
                        favProducts={this.props.route.params.favProducts}
                      />
                    ))
                  : this.props.route.params.products
                      .slice(0)
                      .reverse()
                      .map((item, ind) => (
                        <ProcardsSmall
                          navigation={this.props.navigation}
                          key={1}
                          product={item}
                          filter1={this.props.filtered}
                          favProducts={this.props.route.params.favProducts}
                        />
                      ))}
              </View>
            )}
          </ScrollView>
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
  filtered: state.Filter.filterData,
  searchInput: state.Search1.searchData1,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      filterAsync,
      searchAsync,
      search1Async,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SingleCateg);
