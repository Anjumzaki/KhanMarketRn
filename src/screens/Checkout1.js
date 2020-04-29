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
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChangeText as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import {
  btnStyles,
  bottomTab,
  lines,
  conStyles,
  textStyles,
  textIn,
} from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import { cartAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import timestamp from "time-stamp";
import Modal from "react-native-modalbox";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      isOpen: false,
      date: 0,
      times: 0,
      isChecked: false,
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }
  onClose() {
    console.log("Modal just closed");
  }

  onOpen() {
    console.log("Modal just opened");
  }
  render() {
    console.log("DATEEEEEEEEE", new Date(), console.log(timestamp()));
    console.log(timestamp("DDMMYYYY"));
    console.log(timestamp("YYYY-MM-DD"));

    console.log("CO props user", this.props.user);
    if (this.props.cart.length > 0) {
      var sId = this.props.cart[0].product.storeId;
    } else {
      var sId = "123";
    }

    var subTotal = 0;

    for (var i = 0; i < this.props.cart.length; i++) {
      var temp = this.props.cart[i].price;
      subTotal = subTotal + parseFloat(temp);
    }
    const daysMap = [1, 2, 3, 4, 5];
    const timeMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal3"}
          isDisabled={this.state.isDisabled}
        >
          <LatoText
            fontName="Lato-Regular"
            fonSiz={20}
            col="#5C5C5C"
            text={"Pick a date"}
          />
          <View style={{ paddingBottom: 10 }} />
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {daysMap.map((index, item) => (
              <TouchableOpacity
                onPress={() => this.setState({ date: item })}
                style={
                  this.state.date == item ? styles.dSelect : styles.dUnSelect
                }
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={this.state.date == item ? "white" : "#5C5C5C"}
                  txtAlign={"center"}
                  text={"Jan " + (item + 1)}
                />
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={10}
                  col={this.state.date == item ? "white" : "#5C5C5C"}
                  txtAlign={"center"}
                  text={days[item]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ width: "100%" }}
          >
            {timeMap.map((index, item) => (
              <TouchableOpacity
                onPress={() => this.setState({ times: item })}
                style={
                  this.state.times == item ? styles.tSelect : styles.tUnSelect
                }
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col={this.state.times == item ? "white" : "#5C5C5C"}
                  txtAlign={"center"}
                  text={item + 1 + ":00 PM  -  " + (item + 2 + ":00 PM")}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ paddingBottom: 10 }} />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity onPress={() => this.refs.modal3.close()}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                txtAlign={"center"}
                text={"Cancel"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.refs.modal3.close()}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col="#B50000"
                txtAlign={"center"}
                text={"Save"}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          style={[styles.modal, styles.modal3]}
          position={"center"}
          ref={"modal4"}
          isDisabled={this.state.isDisabled}
        >
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <View style={{ flexGrow: 1 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#5C5C5C"
                text={"Contact Details"}
                txtAlign={"center"}
              />
              <View
                style={{
                  width: "90%",
                  flex: 1,
                  justifyContent: "space-evenly",
                }}
              >
                <View>
                  <View
                    style={[
                      textIn.Flabel,
                      { width: "100%", paddingTop: wp("5%") },
                    ]}
                  >
                    <View>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Enter Name"}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={[textIn.input, { width: "100%" }]}
                        onChangeText={(name) =>
                          this.setState({
                            name,
                          })
                        }
                        value={this.state.name}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={{ marginBottom: 5, marginTop: wp("6%") }}>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Phone Number"}
                      />
                    </View>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Image
                        style={{ width: wp("8%") }}
                        source={require("../../assets/america.png")}
                      />
                      <View
                        style={{
                          width: wp("8%"),
                          justifyContent: "center",
                          alignContent: "center",
                          paddingLeft: 5,
                        }}
                      >
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"+1"}
                        />
                      </View>
                      <TextInput
                        placeholder={"(555) 555-5678"}
                        keyboardType={"numeric"}
                        onChangeText={(mobile) =>
                          this.setState({
                            mobile,
                          })
                        }
                        value={this.state.mobile}
                        style={[textIn.input, { width: "77.5%" }]}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    textIn.Flabel,
                    { width: "100%", paddingTop: wp("5%") },
                  ]}
                >
                  <View>
                    <LatoText
                      fontName="Lato-Regular"
                      fonSiz={17}
                      col="#5C5C5C"
                      text={"Enter Email (optional)"}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={[textIn.input, { width: "100%" }]}
                      onChangeText={(name) =>
                        this.setState({
                          name,
                        })
                      }
                      value={this.state.name}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity onPress={() => this.refs.modal4.close()}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#B50000"
                  txtAlign={"center"}
                  text={"Cancel"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.refs.modal4.close()}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="#B50000"
                  txtAlign={"center"}
                  text={"Save"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Pickup From"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 0,
              paddingTop: 0,
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 44, height: 44, marginRight: 10 }}
              source={require("../../assets/new.png")}
            />
            <View>
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text={this.props.store.name}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingLeft: 70,
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={this.props.store.address}
            />
          </View>

          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,

              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Order should be ready till"
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col={"#2E2E2E"}
                txtAlign={"center"}
                text={"Jan " + (this.state.date + 1)}
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col={"#2E2E2E"}
                txtAlign={"center"}
                text={" " + days[this.state.date]}
              />

              <LatoText
                fontName="Lato-Regular"
                fonSiz={15}
                col={"#2E2E2E"}
                txtAlign={"center"}
                text={
                  " " +
                  (this.state.times + 1 + ":00 PM  -  ") +
                  (this.state.times + 2 + ":00 PM")
                }
              />
            </View>
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => this.refs.modal3.open()}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={"#2E2E2E"}
              />
            </TouchableOpacity>
          </View>
          <View style={lines.simple} />
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#2E2E2E"
              text="Contact Details"
            />
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => this.refs.modal4.open()}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={"#2E2E2E"}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Name"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={this.props.user.user.name}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Phone Number"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={this.props.user.user.mobile}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text="Email (optional)"
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={this.props.user.user.email}
            />
          </View>
          <View style={{ alignItems: "flex-end", paddingHorizontal: 20 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Checkout1")}
              style={[btnStyles.cartBtnOutline, { width: "35%" }]}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={18}
                col="#2E2E2E"
                text="VERIFY"
              ></LatoText>
            </TouchableOpacity>
          </View>
          <View style={lines.simple} />
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text="Will someone else be picking your order?"
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            <CheckBox
              style={{ flex: 1 }}
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked,
                });
              }}
              isChecked={this.state.isChecked}
              rightText={"Yes"}
            />
          </View>

          {this.state.isChecked && (
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <View style={{ flexGrow: 1 }}>
                <View
                  style={{
                    width: "100%",
                    flex: 1,
                    justifyContent: "space-evenly",
                    paddingHorizontal:20
                  }}
                >
                  <View>
                    <View
                      style={[
                        textIn.Flabel,
                        { width: "100%", paddingTop: wp("5%") },
                      ]}
                    >
                      <View>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"Enter Name"}
                        />
                      </View>
                      <View>
                        <TextInput
                          style={[textIn.input, { width: "100%" }]}
                          onChangeText={(name) =>
                            this.setState({
                              name,
                            })
                          }
                          value={this.state.name}
                        />
                      </View>
                    </View>
                    <View>
                      <View style={{ marginBottom: 5, marginTop: wp("6%") }}>
                        <LatoText
                          fontName="Lato-Regular"
                          fonSiz={17}
                          col="#5C5C5C"
                          text={"Phone Number"}
                        />
                      </View>
                      <View
                        style={{
                          marginBottom: 10,
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Image
                          style={{ width: wp("8%") }}
                          source={require("../../assets/america.png")}
                        />
                        <View
                          style={{
                            width: wp("8%"),
                            justifyContent: "center",
                            alignContent: "center",
                            paddingLeft: 5,
                          }}
                        >
                          <LatoText
                            fontName="Lato-Regular"
                            fonSiz={17}
                            col="#5C5C5C"
                            text={"+1"}
                          />
                        </View>
                        <TextInput
                          placeholder={"(555) 555-5678"}
                          keyboardType={"numeric"}
                          onChangeText={(mobile) =>
                            this.setState({
                              mobile,
                            })
                          }
                          value={this.state.mobile}
                          style={[textIn.input, { width: "81%" }]}
                        />
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      textIn.Flabel,
                      { width: "100%", paddingTop: wp("5%") },
                    ]}
                  >
                    <View>
                      <LatoText
                        fontName="Lato-Regular"
                        fonSiz={17}
                        col="#5C5C5C"
                        text={"Enter Email (optional)"}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={[textIn.input, { width: "100%" }]}
                        onChangeText={(name) =>
                          this.setState({
                            name,
                          })
                        }
                        value={this.state.name}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        <View style={bottomTab.cartSheet}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ cart: true })
              axios.post('https://sheltered-scrubland-52295.herokuapp.com/add/order',{
                storeId: sId,
                products: this.props.cart,
                totalAmount: subTotal,
                storeName: this.props.store.name,
                storeAddress: this.props.store.address,
                storePhone: this.props.store.phone,
                userId: this.props.user.user._id,
                name: this.props.user.user.name,
                phone: this.props.user.user.mobile,
                email: this.props.user.user.email,
                address: "bac Street",
                orderTime: "5:00 PM",
                orderDate: timestamp('DD-MM-YYYY'),
                orderTimeZone: "UST",
                tax: "2.78",
                orderNumber: "zk342"
              }).then(resp =>  {
                this.props.navigation.navigate('QrCode',{
                  orderId: resp.data.order1._id
                })
              })
            }}
            style={[btnStyles.cartBtn, { width: "100%" }]}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="CONFIRM"
            ></LatoText>
          </TouchableOpacity>
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
  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998",
  },

  modal3: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width - 50,
  },

  modal4: {
    height: 300,
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },
  dUnSelect: {
    width: "18%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
  },
  dSelect: {
    width: "18%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
    backgroundColor: "#2E2E2E",
  },
  tSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    backgroundColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
  tUnSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
