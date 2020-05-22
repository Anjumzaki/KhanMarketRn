import React from "react";
import { StyleSheet, Text, View, Image, Button,Dimensions } from "react-native";
import { cardStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import { storeAsync, cartAsync, cartSizeAsync } from "../store/actions";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";

class StoreCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     image:"",
     isEnabled: true,
    };
  } 
  componentDidMount() {
        const ref = firebase
          .storage()
          .ref("/store_images/"+this.props.id+".jpg");
        ref.getDownloadURL().then(url => {
          this.setState({ image: url });
        }).catch(err=>console.log(err));
  }
  render() {
    console.log("cart",this.props.cart)
    console.log("cart",this.props.store)
    const { name, distance, address, id, phone } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {

          if(this.props.cart.length === 0){
            this.props.storeAsync({
              name: name,
              address: address,
              id: id,
              phone : phone
            })
            this.props.navigation.push("StoreDetails",{
            storeId: id
            })
          }else{
            if(this.props.store.name === name ){
              this.props.storeAsync({
                name: name,
                address: address,
                id: id,
                phone : phone
              })
              this.props.navigation.push("StoreDetails",{
              storeId: id
              })
            }else{
              // alert("change store"/)
              this.refs.modal3.open()

            }
          }
          
          
      
      }}
        style={cardStyles.storeCard}
      >
        <View style={cardStyles.cImgWrap}> 
          <Image
            style={{ width: "100%", height: 200 }}
            source={{uri:this.state.image}}
          />
        </View>
        <View style={cardStyles.cTextWrap}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#5C5C5C"
              text={name.substring(0,18)}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#B50000"
              text={distance}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 10
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={17}
              col="#89898C"
              text={address}
            />
          </View>
        </View>

        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          isDisabled={this.state.isDisabled}
        >
            <Text>You are changing the store, so you will lost your cart items</Text>
            <View>
              <Button onPress={() => this.refs.modal3.close()} title="Cancel">
              </Button>
              <Button onPress={() => {
                this.props.cartAsync([])
                this.refs.modal3.close()
                this.props.storeAsync({
                  name: name,
                  address: address,
                  id: id,
                  phone : phone
                })
                this.props.cartSizeAsync(0)

                this.props.navigation.push("StoreDetails",{
                  storeId: id
                })

                }} title="Okay">
              </Button>
            </View>
        </Modal>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({

  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modal3: {
    height: 230,
    width: Dimensions.get("window").width - 100,
  },
});


const mapStateToProps = state => ({
  store: state.Store.storeData, 
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  store: state.Store.storeData,
  cart: state.Cart.cartData, 

});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
      {
          storeAsync,
          cartAsync,
          cartSizeAsync
      },
      dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreCard);

