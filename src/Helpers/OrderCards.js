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
    orderDate: new Date(),
  };

  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 0) {
      this.setState({ qt: preNum });
    }
  }
  componentDidMount() {
    this.setState({
      orderDate: this.props.order.orderDate,
    });
  }
  reformatDate(s) {
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var date = s.split(/[ -]/);
    return months[parseInt(date[1])] + " " + date[0] + ", " + date[2];
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
                token: this.props.token,
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
                width: Dimensions.get("window").width - 50,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={"Order # "}
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#5C5C5C"
                  text={
                    this.props.order.orderNumber
                      ? this.props.order.orderNumber.toUpperCase()
                      : null
                  }
                  // text={"Order # "+ this.props.order.orderNumber !== undefined ? this.props.order.orderNumber.toUpperCase() : null}
                />
              </View>

              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col={this.props.order.statuseCode == 4 ? "red" : "#2AA034"}
                text={this.props.order.statusName}
              />
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
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
              fonSiz={17}
              col="#5C5C5C"
              text={
                this.props.order.orderDate &&
                this.reformatDate(this.props.order.orderDate)
              }
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#5C5C5C"
              text={this.props.order.orderTime}
            />
          </TouchableOpacity>
          {this.props.type === "active" ? (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => {
                if (this.props.order.statusCode === 0) {
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
                              "https://secret-cove-59835.herokuapp.com/v1/transaction/status/" +
                                this.props.order.orderID +
                                "/4",
                              { a: "a" },
                              {
                                headers: {
                                  authorization: this.props.token,
                                },
                              }
                            )
                            .then((resp) => {
                              alert("Order Cancelled Successfully.");
                              this.props.getData();
                            })
                            .catch((err) => console.log(err));
                          axios
                            .put(
                              "https://lit-peak-13067.herokuapp.com/edit/order/reject/" +
                                this.props.order.orderID
                            )
                            .then((resp) => {
                              alert("Order Cancelled Successfully.");
                              this.props.getData();
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
