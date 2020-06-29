import React from "react";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import { StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "./LatoText";
import axios from "axios";
class OrderCards extends React.Component {
  state = {
    heart: true,
    image: "",
    qt: 1,
  };

  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }
  render() {
    return (
      <View
        // onPress={() =>
        //   this.props.navigation.navigate("OrderDetails", {
        //     order: this.props.order,
        //   })
        // }
        style={styles.procards}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("OrderDetails", {
                order: this.props.order,
              })
            }
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingVertical: 10,
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#5C5C5C"
              text={this.props.order.storeName}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={
                  "Order # " + this.props.order.orderNumber
                    ? this.props.order.orderNumber.toUpperCase()
                    : null
                }
                // text={"Order # "+ this.props.order.orderNumber !== undefined ? this.props.order.orderNumber.toUpperCase() : null}
              />
              {this.props.order.isRejected === true ? (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#808080"
                  text={"Cancelled"}
                />
              ) : (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#2AA034"
                  text={
                    this.props.order.isAccepted === true &&
                    this.props.order.isInPreparation === true
                      ? "Being Prepared"
                      : this.props.order.isAccepted === true &&
                        this.props.order.isReady === true
                      ? "Ready"
                      : this.props.order.isAccepted === true &&
                        this.props.order.isPicked === true
                      ? "Completed"
                      : "in queue"
                  }
                />
              )}
            </View>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "Total: $" +
                (
                  parseFloat(this.props.order.totalAmount) +
                  parseFloat(this.props.order.tax)
                ).toFixed(2)
              }
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("OrderDetails", {
                order: this.props.order,
              })
            }
            style={{ paddingVertical: 10 }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={12}
              col="#5C5C5C"
              text={this.props.order.orderTime}
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={12}
              col="#5C5C5C"
              text={this.props.order.orderDate}
            />
          </TouchableOpacity>
          {this.props.type === "active" ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => {
                if (this.props.order.isAccepted === false) {
                  Alert.alert(
                    "Alert!",
                    "Are you sure you want to cancel the order?",
                    [
                      {
                        text: "No",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          axios
                            .put(
                              "https://lit-peak-13067.herokuapp.com/edit/order/reject/" +
                                this.props.order._id
                            )
                            .then((resp) => {
                              // this.setState({bd: true})
                              alert("Order Cancelled Successfully.");
                              this.props.navigation.navigate("Home");
                            })
                            .catch((err) => console.log(err));
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                } else {
                  alert("Order cannot be cancelled after preperation state.");
                }
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                text={"Cancel Order"}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View>
          <View style={{ marginBottom: 10 }}></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          ></View>
        </View>
      </View>
    );
  }
}
export default OrderCards;
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
    height: Dimensions.get("window").width / 2.5,
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
    paddingHorizontal: 10,
  },
});
