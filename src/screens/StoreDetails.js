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
import ProcardsSmall from "../Helpers/ProcardsSmall";

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
    var uid = this.props.user.user.userId
      ? this.props.user.user.userId
      : this.props.user.user.userID;
    // alert(uid);
    this.setState(
      {
        loading: true,
      },
      async () => {
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
            "https://secret-cove-59835.herokuapp.com/v1/item/featured/" +
              this.props.route.params.storeId,
            {
              headers: {
                authorization: token,
              },
            }
          )
          .then((resp) => {
            this.setState({ featuredProducts: resp.data.result });
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
            this.setState({ categories: resp.data.result });
          })
          .catch((err) => console.log(err));
        axios
          .get(
            "https://secret-cove-59835.herokuapp.com/v1/store/user/ref_prod_fav/" +
              uid +
              "/" +
              this.props.route.params.storeId,
            {
              headers: {
                authorization: token,
              },
            }
          )
          .then((resp) => {
            this.setState({ favourites: resp.data.result, loading: false });
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
    
    var searchedProducts = [];
    var key1 = this.props.searchInput;
    // alert(key1);
    if (this.props.searchInput) {
      let totalProducts = this.state.products;
      // alert(JSON.stringify(totalProducts))
      searchedProducts = totalProducts.filter(function (product) {
        // alert(JSON.stringify(product.name))
        return product.productName
          ? product.productName.toLowerCase().includes(key1.toLowerCase())
          : null;
      });
    }
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
            {this.props.searchInput ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    // justifyContent: "space-between",s
                    flexWrap: "wrap",
                    // flexWrap: "row-wrap",
                  }}
                >
                  {searchedProducts.map((cat, index) => (
                    <ProcardsSmall
                      navigation={this.props.navigation}
                      key={index}
                      product={cat}
                      favProducts={this.props.favProducts}
                    />

                    // <CardsRow
                    //   navigation={this.props.navigation}
                    //   key={index}
                    //   products={cat.products}
                    //   name={this.capitalize(cat.productName)}
                    //   favProducts={this.state.favourites}
                    // />
                  ))}
                </View>
              </>
            ) : (
              fp.map((cat, index) =>
                cat.products.length > 0 ? (
                  <CardsRow
                    navigation={this.props.navigation}
                    key={index}
                    products={cat.products}
                    name={this.capitalize(cat.name)}
                    favProducts={this.state.favourites}
                  />
                ) : null
              )
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
