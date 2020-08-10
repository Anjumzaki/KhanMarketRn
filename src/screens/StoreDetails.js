import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Slider from "../Components/Slider";
import CardsRow from "../Components/CardsRow";
import axios from "axios";
import SingleStoreHeader from "../Helpers/SingleStoreHeader";
import { bindActionCreators } from "redux";
import { filterAsync, searchAsync, userAsync } from "../store/actions";
import { connect } from "react-redux";

class StoreDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      finalProducts: [],
      featuredProducts: [],
      loading: true,
    };
  }
  getMyData = async () => {
    const token = this.props.user.token;

    this.setState(
      {
        loading: true,
      },
      () => {
        axios
          .post(
            "https://secret-cove-59835.herokuapp.com/v1/item/store/" +
              this.props.route.params.storeId,
            { asd: "sxd" },
            {
              headers: {
                authorization: token,
              },
            }
          )
          .then((resp) => {
            this.setState({ products: resp.data.result });
          })
          .catch((err) => console.log(err));

        axios
          .get(
            "https://lit-peak-13067.herokuapp.com/get/all/featured/products/" +
              this.props.route.params.storeId
          )
          .then((resp) => {
            this.setState({ featuredProducts: resp.data });
          })
          .catch((err) => console.log(err));

        axios
          .get("https://secret-cove-59835.herokuapp.com/v1/subCategory", {
            headers: {
              authorization: token,
            },
          })
          .then((resp) => {
            // console.log("Cat", resp.data)
            this.setState({ categories: resp.data.result, loading: false });
          })
          .catch((err) => console.log(err));
      }
    );
  };
  componentDidMount() {
    this.getMyData();
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getMyData();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  componentWillUnmount() {
    this.props.searchAsync("");
  }
  render() {
    var fp = [];
    this.state.categories.map((category, index) =>
      fp.push({
        name: category.subCategoryName,
        products: this.state.products.filter(function (item) {
          return item.subCategoryName == category.subCategoryName;
        }),
      })
    );

    return (
      <View>
        {this.state.loading ? (
          <View style={{ paddingVertical: 50 }}>
            <ActivityIndicator color="gray" size="large" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {!this.props.searchInput &&
            this.state.featuredProducts.length > 0 ? (
              <Slider
                featuredProducts={this.state.featuredProducts}
                navigation={this.props.navigation}
              />
            ) : null}
            {this.props.searchInput
              ? searchedProducts.map((cat, index) =>
                  cat.products.length > 0 ? (
                    <CardsRow
                      navigation={this.props.navigation}
                      key={index}
                      products={cat.products}
                      name={this.capitalize(cat.name)}
                    />
                  ) : null
                )
              : fp.map((cat, index) =>
                  cat.products.length > 0 ? (
                    <CardsRow
                      navigation={this.props.navigation}
                      key={index}
                      products={cat.products}
                      name={this.capitalize(cat.name)}
                    />
                  ) : null
                )}
            <View style={{ paddingTop: 10 }}></View>
          </ScrollView>
        )}
      </View>
    );
  }
}
// export default StoreDetails
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  searchInput: state.Search.searchData,
  user: state.user.user,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      filterAsync,
      searchAsync,
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetails);
