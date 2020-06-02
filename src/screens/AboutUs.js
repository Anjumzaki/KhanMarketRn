import React from "react";
import { View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import LatoText from "../Helpers/LatoText";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  Entypo,
  Feather,
  FontAwesome,
  EvilIcons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
export default class AboutUs extends React.Component {
  render() {
    return (
      <>
        <View
          style={{
            paddingTop: getStatusBarHeight(),
            backgroundColor: "#2E2E2E",
            flexDirection: "row",
          }}
        ></View>
        <View style={{ backgroundColor: "white" }}>
          <TouchableOpacity
            style={{ padding: 20 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" color="#2E2E2E" size={25} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={25}
              col="#2E2E2E"
              text={"The Node"}
            />
            <View style={{ paddingTop: 30 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#2E2E2E"
              text={"About Us"}
            />
            <View style={{ paddingTop: 20 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "Node is a platform for American consumers to place an online order for groceries and daily goods from grocers of your local community. "
              }
            />
            <View style={{ paddingTop: 20 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "With the current pandemic putting a ton of small business out of work, we have created this platform for you to connect to some passionate grocers and marts that might be a doorstep away from you but you might not have heard off. "
              }
            />
            <View style={{ paddingTop: 20 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "At the moment we are technology company pertained towards taking orders requiring pick up from your local store only. We are determined to push industry standards to provide the best and the most seamless experience, from mobile app to instore pickup of the freshest goods in the market. Hence, our small team is focused on one service only. "
              }
            />
            <View style={{ paddingTop: 20 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "We are excited to make doing groceries the most time efficient and hassle free chore in your life. However, as we grow together, we intend to simplify your life with other services that are in the pipeline."
              }
            />
            <View style={{ paddingTop: 20 }} />

            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={
                "The more you support your local community the more we grow together. "
              }
            />
            <LatoText
              fontName="Lato-Regular"
              fonSiz={17}
              col="#2E2E2E"
              text={"We welcome you,"}
            />
            <View style={{ paddingTop: 20 }} />
          </View>
        </ScrollView>
      </>
    );
  }
}
