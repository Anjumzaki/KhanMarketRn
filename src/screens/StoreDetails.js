import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";

import Slider from '../Components/Slider'
import CardsRow from '../Components/CardsRow'
import axios from "axios";
import SingleStoreHeader from "../Helpers/SingleStoreHeader";
import { bindActionCreators } from "redux";
import { filterAsync } from "../store/actions";
import { connect } from "react-redux";

class StoreDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      finalProducts: [],
      featuredProducts: []
    };
  }

  componentDidMount() {

    axios.get("https://sheltered-scrubland-52295.herokuapp.com/get/all/products/" + this.props.route.params.storeId)
      .then(resp => {
        console.log("PRODUCTS", resp.data)
        this.setState({ products: resp.data })
      })
      .catch(err => console.log(err))

    axios.get("https://sheltered-scrubland-52295.herokuapp.com/get/all/featured/products/" + this.props.route.params.storeId)
      .then(resp => {
        this.setState({ featuredProducts: resp.data, loading: false })
      })
      .catch(err => console.log(err))



    axios.get("https://sheltered-scrubland-52295.herokuapp.com/get/all/subCategories")
      .then(resp => {
        // console.log("Cat", resp.data)
        this.setState({ categories: resp.data })
      })
      .catch(err => console.log(err))

  }
  capitalize = (s) => { 
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  render() {
    var fp = []
    this.state.categories.map((category, index) => (
      fp.push({
        name: category.subCategory,
        products: this.state.products.filter(function (item) {
          return item.productType == category.subCategory;
        })
      })
    ))
    console.log("FFFFFPPPPPP", fp)
    console.log("PROPSSSSSS", this.props)
    console.log("stateeeeeeeee", this.state)

    var searchedProducts=[];
    var key1 = this.props.searchInput;
    if (this.props.searchInput) {

      for(var i=0; i<fp.length; i++){
        let totalProducts = [...fp[i].products];
        console.log("TOTAL PODUCT111",totalProducts)
        var temp = totalProducts.filter(function (product) {
            return (product.productName ? product.productName.toLowerCase().includes(key1.toLowerCase()) : null);
        });
        searchedProducts.push({
          name: fp[i].name,
          products: temp
        })
      }
   
     }
     console.log("searchedProducts111",searchedProducts)


    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false} >
          {!this.props.searchInput && this.state.featuredProducts.length > 0 ? (
            <Slider featuredProducts={this.state.featuredProducts} navigation={this.props.navigation}/>
          ) : null}
          {this.props.searchInput ? (
              searchedProducts.map((cat, index) => (
                cat.products.length > 0 ? (
                  <CardsRow navigation={this.props.navigation} key={index} products={cat.products} name={this.capitalize(cat.name)} />
                ) : null
              ))
          ): (
          fp.map((cat, index) => (
            cat.products.length > 0 ? (
              <CardsRow navigation={this.props.navigation} key={index} products={cat.products} name={this.capitalize(cat.name)} />
            ) : null
          ))
          )
          }
          <View style={{ paddingTop: 10 }}>

          </View>
        </ScrollView>
      </View>

    );
  }
}
// export default StoreDetails
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  searchInput: state.Search.searchData
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
      {
        filterAsync, 
      },
      dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreDetails);