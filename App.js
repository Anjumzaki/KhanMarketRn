import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { CreateAccount, Search, Details, Search2, Profile } from "./src/Screens";
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import Map from "./src/screens/Map";
import StoreHeader from "./src/Helpers/StoreHeader";
import StackHeader from "./src/Helpers/StackHeader";
import {
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";
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
const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Map" component={Map} />
    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator
  >
    <HomeStack.Screen
      name="Home"
      component={Home}
      options={{ header: props => <StoreHeader {...props} /> }}
    />
    <HomeStack.Screen
      name="StoreDetails"
      component={StoreDetails}
      options={{ header: props => <SingleStoreHeader {...props} />}}
    />
    <HomeStack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{
        header: props => (
          <StackHeader cart={true} nameTitle="Product Details" {...props} />
        ),
        tabBarOptions: false
      }}
    />
    <HomeStack.Screen
      name="Cart"
      component={Cart}
      options={{
        header: props => (
          <StackHeader cart={false} nameTitle="Cart" {...props} />
        )
      }}
    />
    <HomeStack.Screen
      name="Checkout1"
      component={Checkout1}
      options={{
        header: props => (
          <StackHeader cart={false} nameTitle="PICK UP DETAILS" {...props} />
        )
      }}
    />
    <HomeStack.Screen
      name="QrCode"
      component={QrCode}
      options={{
        header: props => (
          <StackHeader cart={false} nameTitle="ORDER PLACED" {...props} />
        )
      }}
    />
    <HomeStack.Screen
      name="StoreInfo"
      component={StoreInfo}
      options={{
        header: props => (
          <StackHeader cart={false} nameTitle="STORE INFO" {...props} />
        )
      }}
    />
    <HomeStack.Screen
      name="Filters"
      component={Filters}
      options={{
        header: props => (
          <StackHeader cart={false} nameTitle="Filters" {...props} />
        )
      }}
    />
    <HomeStack.Screen
      name="SingleCateg"
      component={SingleCateg}
      
      options={{
        header: props => (
          <SingleCategHeader cart={false} nameTitle="BEEF" {...props} />
        )
      }}
    />
  </HomeStack.Navigator>
);
const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="Search" component={Search} />
    <SearchStack.Screen name="Search2" component={Search2} />
    <SearchStack.Screen
      name="StoreDetails"
      component={StoreDetails}
      options={{ header: props => <SingleStoreHeader {...props} />, }}
    
    />
  </SearchStack.Navigator>
);
const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} />
  </ProfileStack.Navigator>
);
const TabsScreen = () => (
  <Tabs.Navigator
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
        } else if (route.name === "My Orders") {
          return (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }

        // You can return any component that you like here!
      }
    })}
    tabBarOptions={{
      activeTintColor: "#2E2E2E",
      inactiveTintColor: "#89898C",
    }}
  >
    <Tabs.Screen name="Favourites" component={SearchStackScreen} />
    <Tabs.Screen name="Home" component={HomeStackScreen} />
    <Tabs.Screen name="My Orders" component={SearchStackScreen} />
  </Tabs.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={TabsScreen} />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="Auth"
      component={AuthStackScreen}
      options={{
        animationEnabled: false
      }}
    />
    <RootStack.Screen
      name="App"
      component={DrawerScreen}
      options={{
        animationEnabled: false
      }}
    />
  </RootStack.Navigator>
);
export default () => {
  return (
    <StoreProvider store={store}>
        <NavigationContainer>
          <RootStackScreen />
        </NavigationContainer>
    </StoreProvider>
  );
};
