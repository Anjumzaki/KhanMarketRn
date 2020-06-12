import React, { PureComponent } from "react";
import firebase from "firebase";
import {
  Image
} from "react-native";


export default class CartCards extends PureComponent {
  state = {
    heart: false,
    image: "",
    qt: 0,
    cart: [],
  };

  async componentWillMount() {
    this.setState({image: ""})
    const ref = firebase
      .storage()
      .ref("/product_images/" + this.props.id + "_1.jpg");
      
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url});
      })
      .catch((err) => console.log(err));

    
  }


  render() {
 
    return (
      
          <Image
            style={{
              width: 53,
              height: 61,
              marginRight: 10,
              borderRadius: 10,
            }}
            source={{ uri: this.state.image }}
          />
    
    );
  }
}

