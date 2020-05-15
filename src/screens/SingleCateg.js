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
import { filterAsync, searchAsync } from "../store/actions";
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
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
    this.props.searchAsync('')
  }

  render() {
    console.log(
      "Signle cat props",
      this.props.route.params,
      this.props.filtered
    );
    var searchedProducts = [];
    var key1 = this.props.searchInput;
    if (this.props.searchInput) {
      let totalProducts = [...this.props.route.params.products];
      console.log("TOTAL PODUCT111", totalProducts);
      searchedProducts = totalProducts.filter(function (product) {
        return product.productName
          ? product.productName.toLowerCase().includes(key1.toLowerCase())
          : null;
      });
      console.log("searchedProducts111", searchedProducts);
    }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
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
              {this.props.filtered === "Asc"
                ? this.props.route.params.products.map((item, ind) => (
                    <ProcardsSmall
                      navigation={this.props.navigation}
                      key={1}
                      product={item}
                      filter1={this.props.searchInput}
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
                      />
                    ))}
            </View>
          )}
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
  filtered: state.Filter.filterData,
  searchInput: state.Search.searchData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      filterAsync,
      searchAsync
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SingleCateg);
