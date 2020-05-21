import React from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  ScrollView, 
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "./LatoText";
import { btnStyles } from "../styles/base";
import { bindActionCreators } from "redux";
import { cartAsync, cartSizeAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";

class FavCards extends React.Component {
  state = {
    heart: true,
    image: "",
    qt: 1,
    favourites: []
  };


  componentDidMount(){
    console.log("FAVVV",this.props.product)
    const ref = firebase
      .storage()
      .ref("/product_images/" + this.props.product.product._id + "_1.jpg");
    ref.getDownloadURL().then(url => {
      this.setState({ image: url });
    }).catch(err=>console.log(err));

    console.log("FAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",this.props.product._id,this.props.product.product.favourites) 
    if(this.props.product.product.favourites === undefined){

      console.log("IN OIFFFFFFFFFFFFFFFFF")
        this.setState({favourites: []})
    }else{
      console.log("IN Elseeeeeeeeeee")

      for(var i=0; i<this.props.product.product.favourites.length; i++){
        if(this.props.product.product.favourites[i].userId === this.props.user.user._id){
          this.setState({heart: true})
        } 
      }
      this.setState({favourites: this.props.product.product.favourites})
    }

  }

  // handleChange(num) {
  //   var preNum = this.state.qt;
  //   preNum = num + preNum;
  //   if (preNum >= 1) {
  //     this.setState({ qt: preNum });
  //   }
  // }
 
  handleChange(num) {

    console.log("CHNAGE QUNTIYTTYyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }


    var pCart=this.props.cart;
    console.log("pcartttttt666666666666666666666666666666666666666666666",pCart)
    var that =this
      pCart.map(function(pro,ind) {
       console.log("cehck",pro.product.productName ,that.props.product.product.productName)
       if(pro.product.productName === that.props.product.product.productName){
          pro.quantity = that.state.qt+num
       }

    });

    console.log("pacart 111111111111111",pCart)

      this.props.cartAsync(pCart)

  }
  render() {
    console.log("PROPS and users", this.props.user,this.props.product, this.state)
    return (
      <View style={styles.procards}>
    

        <View style={styles.wrapCards}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ProductDetails", {
                product: this.props.product.product,
              })
            }
          >
            <Image
              style={styles.proCardsImage}
              source={{uri: this.state.image}}
            />
          </TouchableOpacity>
          <View style={styles.underCard}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#5C5C5C"
                text={this.props.product.product.productName}
              ></LatoText>

              <TouchableOpacity
                onPress={async() => {
                  console.log("HEARTTTTTTTTT",this.state.heart)
                console.log("fav",this.state.favourites)
                if(this.state.heart === false){
                    await this.state.favourites.push({userId: this.props.user.user._id})

                    axios.post('https://sheltered-scrubland-52295.herokuapp.com/add/favourite',{
                        userId: this.props.user.user._id,
                        product: this.props.product,
                        storeName: this.props.store.name
                    })
                    .then(resp => console.log(resp))
                    .catch(err => console.log(err))
                }else{
                  console.log("iNCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
                  var that=this
                  this.state.favourites = this.state.favourites.filter(function(el){
                    return el.userId !== that.props.user.user._id;
                    // console.log("asd",el.userId,that.props.user.user._id)
                  });

                  axios.delete('https://sheltered-scrubland-52295.herokuapp.com/delete/favourite/'+this.props.user.user._id+'/'+this.props.product.product._id)
                  .then(resp =>console.log("asd",resp))
                  .catch(err => err)
                  console.log("afteeeeeeeeeeeeeeeeeeeeeeee")

                }
                console.log("FAVVVVVVVVV33",this.state.favourites)

                axios.put('https://sheltered-scrubland-52295.herokuapp.com/edit/favourites/'+this.props.product.product._id,{
                  favourites: this.state.favourites
                })
                .then(resp => {
                  this.setState(prevState => {
                    return {
                      heart: !prevState.heart
                    };
                  })
                })
                .catch(err => console.log(err))
              }}
              >
                {this.state.heart ? (
                  <AntDesign color="#B50000" size={18} name="heart" />
                ) : (
                  <AntDesign color="#B50000" size={18} name="hearto" />
                )}
              </TouchableOpacity>
            </View>
            {/* <View style={{ flex: 1, flexDirection: "row", paddingTop: 5 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#89898C"
                lineThrough="line-through"
                text={"$" + this.props.product.product.price + " / lb"}
              ></LatoText>
              <Text> 

              </Text>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#2E2E2E"
                text={
                  "$" +
                  (parseInt(this.props.product.product.price) -
                    (parseInt(this.props.product.product.price) * parseInt(this.props.product.product.discount)) /
                      100) +
                  " / lb"
                }
              ></LatoText>
            </View> */}

            <View style={{ flex: 1, flexDirection: "row", paddingTop: 5 }}>

              <View style={{marginRight:5}} >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#2E2E2E"
                text={
                  "$" +
                  (parseInt(this.props.product.product.price) -
                    (parseInt(this.props.product.product.price) * parseInt(this.props.product.product.discount)) /
                      100) +
                  " / lb"
                }
              ></LatoText>
                </View>
              <View style={{marginLeft:5}}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={13}
                  col="#89898C"
                  lineThrough="line-through"
                  text={"$" + this.props.product.product.price + " / lb"}
                ></LatoText>
                </View>


              </View>
            <View style={{marginBottom:10}}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                text={"You will save " + this.props.product.product.discount + "%"}
              ></LatoText>
            </View>
           <View>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={13}
                col="#2E2E2E"
                text={this.props.product.storeName}
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                text={"3 miles away"}
              />
           </View>
            
            <View style={{ marginTop: 10 }}>
              {this.state.cart ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
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
              ) : (
                <TouchableOpacity
                onPress={() => {
                  var pCart=this.props.cart;
                  pCart.push({
                    product: this.props.product.product,
                    quantity: this.state.qt
                  })
                  this.props.cartAsync(pCart)
                  this.setState({cart: true})
                }}                  style={btnStyles.cartBtn}
                >
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={15}
                    col="white"
                    text="Add To Cart"
                  ></LatoText>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
  procards: {
    width: Dimensions.get("window").width - 20,
    marginLeft: 10,
    height: Dimensions.get("window").width / 2,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 10,
  },
  proCardsImage: {
    width: Dimensions.get("window").width / 3,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: Dimensions.get("window").width / 2,
  },
  underCard: {
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  wrapCards: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").width / 2,
    flexDirection: "row",
  },
});

const mapStateToProps = state => ({
  cart: state.Cart.cartData, 
  loading: state.Cart.cartLoading,
  cartSize: state.CartSize.cartSizeData,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData

});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
      {
          cartAsync, 
          cartSizeAsync
      },
      dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavCards);
