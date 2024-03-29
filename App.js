import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CreateAccount } from "./src/Screens";
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import Map from "./src/screens/Map";
import StackHeader from "./src/Helpers/StackHeader";
import Settings from "./src/screens/Settings";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import ProductDetails from "./src/screens/ProductDetails";
import StoreDetails from "./src/screens/StoreDetails";
import SingleStoreHeader from "./src/Helpers/SingleStoreHeader";
import SingleCategHeader from "./src/Helpers/SingleCategHeader";
import store from "./src/store";
import { Provider as StoreProvider } from "react-redux";
import Cart from "./src/screens/Cart";
import Checkout1 from "./src/screens/Checkout1";
import QrCode from "./src/screens/QrCode";
import StoreInfo from "./src/screens/StoreInfo";
import Filters from "./src/screens/Filters";
import SingleCateg from "./src/screens/SingleCateg";
import CustomDrawerContent from "./src/Helpers/CustomDrawerContent";
import Favourites from "./src/screens/Favourites";
import StackGrayHeader from "./src/Helpers/StackGrayHeader";
import MyOrders from "./src/screens/MyOrders";
import SignUp1 from "./src/screens/SignUp1";
import ChoosePass from "./src/screens/ChoosePass";
import OrderDetails from "./src/screens/OrderDetails";
import AboutUs from "./src/screens/AboutUs";
import LastHeader from "./src/Helpers/LastHeader";
import HomeMap from "./src/screens/HomeMap";
import OneSignal from "react-native-onesignal";
import { Text, View } from "native-base";
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator initialRouteName={"Login"} headerMode="none">
    <AuthStack.Screen name="Map" component={Map} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp1" component={SignUp1} />
    <AuthStack.Screen name="ChoosePass" component={ChoosePass} />

    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const FavouritesStack = createStackNavigator();
const HomeStackScreen = (route) => (
  <HomeStack.Navigator headerMode="screen">
    <HomeStack.Screen
      name="Home"
      component={TabsScreen}
      options={{ header: (props) => null }}
    />
    <HomeStack.Screen
      name="HomeMap"
      component={HomeMap}
      options={{ header: (props) => null }}
    />
    <HomeStack.Screen
      name="StoreDetails"
      component={StoreDetails}
      options={{ header: (props) => <SingleStoreHeader {...props} /> }}
    />
    <HomeStack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{
        header: (props) => (
          <StackHeader cart={true} nameTitle="Product Details" {...props} />
        ),
        tabBarOptions: false,
      }}
    />
    <HomeStack.Screen
      name="Cart"
      component={Cart}
      options={{
        header: (props) => (
          <StackHeader pic={true} cart={false} nameTitle="CART" {...props} />
        ),
      }}
    />
    <HomeStack.Screen
      name="Checkout1"
      component={Checkout1}
      options={{
        header: (props) => (
          <StackHeader
            pic={true}
            cart={false}
            nameTitle="PICK UP DETAILS"
            {...props}
          />
        ),
      }}
    />
    <HomeStack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={{
        header: (props) => (
          <StackHeader
            pic={false}
            cart={false}
            nameTitle="ORDER DETAILS"
            {...props}
          />
        ),
      }}
    />

    <HomeStack.Screen
      name="QrCode"
      component={QrCode}
      options={{
        header: (props) => (
          <LastHeader cart={false} nameTitle="ORDER PLACED" {...props} />
        ),
      }}
    />
    <HomeStack.Screen
      name="StoreInfo"
      component={StoreInfo}
      options={{
        header: (props) => (
          <StackHeader cart={false} nameTitle="STORE INFO" {...props} />
        ),
      }}
    />
    <HomeStack.Screen
      name="Filters"
      component={Filters}
      options={{
        header: (props) => (
          <StackHeader cart={false} nameTitle="Filters" {...props} />
        ),
      }}
    />
    <HomeStack.Screen
      name="SingleCateg"
      component={SingleCateg}
      options={{
        header: (props) => (
          <SingleCategHeader cart={false} nameTitle="BEEF" {...props} />
        ),
      }}
    />

    <HomeStack.Screen
      name="Profile"
      component={Settings}
      options={{
        header: (props) => <StackGrayHeader nameTitle="Settings" {...props} />,
      }}
    />
  </HomeStack.Navigator>
);

const FavouritesStackScreen = () => (
  <FavouritesStack.Navigator initialRouteName="Favourites">
    <FavouritesStack.Screen
      name="Favourites"
      component={Favourites}
      options={{
        header: (props) => (
          <StackGrayHeader cart={true} nameTitle="Favourites" {...props} />
        ),
      }}
    />
  </FavouritesStack.Navigator>
);
const MyOrderStack = createStackNavigator();
const MyOrderStackScreen = () => (
  <MyOrderStack.Navigator initialRouteName="MyOrders">
    <MyOrderStack.Screen
      name="MyOrders"
      component={MyOrders}
      options={{
        header: (props) => <StackGrayHeader nameTitle="My Orders" {...props} />,
      }}
    />
  </MyOrderStack.Navigator>
);

const TabsScreen = () => (
  <Tabs.Navigator
    headerMode={"none"}
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "Home") {
          return (
            <Entypo
              name="home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Favourites") {
          return (
            <Entypo
              name="heart"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "MyOrderStackScreen") {
          return (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }

        // You can return any component that you like here!
      },
    })}
    tabBarOptions={{
      activeTintColor: "#2E2E2E",
      inactiveTintColor: "#89898C",
    }}
  >
    <Tabs.Screen name="Favourites" component={FavouritesStackScreen} />
    <Tabs.Screen name="Home" component={Home} />
    <Tabs.Screen
      options={{
        tabBarLabel: "My Orders",
      }}
      name="MyOrderStackScreen"
      component={MyOrderStackScreen}
    />
  </Tabs.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator
    drawerContentOptions={{
      activeTintColor: "#e91e63",
      itemStyle: { backgroundColor: "transparent"},
      labelStyle: { color: "#FFFFFF" },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route }) => ({
      drawerIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "About Us") {
          return (
            <MaterialCommunityIcons
              name="information"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Favourites") {
          return (
            <Entypo
              name="heart"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Home") {
          return (
            <Entypo
              name="home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "My Orders") {
          return (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Rate Us") {
          return (
            <MaterialCommunityIcons
              name="star"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Share") {
          return (
            <MaterialCommunityIcons
              name="share-variant"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Share") {
          return (
            <Entypo
              name="Home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }
      },
    })}
  >
    <Drawer.Screen name="Home" component={HomeStackScreen} />
    <Drawer.Screen name="Favourites" component={FavouritesStackScreen} />
    <Drawer.Screen name="My Orders" component={MyOrderStackScreen} />
    <Drawer.Screen name="About Us" component={AboutUs} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="Auth"
      component={AuthStackScreen}
      options={{
        animationEnabled: false,
      }}
    />

    <RootStack.Screen
      name="App"
      component={DrawerScreen}
      options={{
        animationEnabled: false,
      }}
    />
  </RootStack.Navigator>
);
export default App = () => {
  useEffect(() => {
    //OneSignal
    OneSignal.init("9b8d1f78-f4db-4ab9-83a1-d5cc67129d0c", {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener("received", onReceived);
    OneSignal.addEventListener("opened", onOpened);
    OneSignal.addEventListener("ids", onIds);
  }, []);

  function onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  function onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  function onIds(device) {
    console.log("Device info: ", device);
  }
  // export default class App extends React.Component {
  //   constructor(properties) {
  //     super(properties);
  //     //Remove this method to stop OneSignal Debugging
  //     // OneSignal.setLogLevel(6, 0);

  //     // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
  //     OneSignal.init("9b8d1f78-f4db-4ab9-83a1-d5cc67129d0c", {
  //       kOSSettingsKeyAutoPrompt: true,
  //     });

  //     // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
  //     // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

  //     OneSignal.addEventListener("received", this.onReceived);
  //     OneSignal.addEventListener("opened", this.onOpened);
  //     OneSignal.addEv;
  //     entListener("ids", this.onIds);
  //   }
  //   componentWillUnmount() {
  //     OneSignal.removeEventListener("received", this.onReceived);
  //     OneSignal.removeEventListener("opened", this.onOpened);
  //     OneSignal.removeEventListener("ids", this.onIds);
  //   }

  //   onReceived(notification) {
  //     console.log("Notification received: ", notification);
  //   }

  //   onOpened(openResult) {
  //     console.log("Message: ", openResult.notification.payload.body);
  //     console.log("Data: ", openResult.notification.payload.additionalData);
  //     console.log("isActive: ", openResult.notification.isAppInFocus);
  //     console.log("openResult: ", openResult);
  //   }

  //   onIds(device) {
  //     console.log("Device info: ", device);
  //   }

  //   render() {
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </StoreProvider>
    // <View>
    //   <Text>asdas</Text>
    // </View>
  );
};
// }
