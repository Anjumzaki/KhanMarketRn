import firebase from "firebase";

var config = {
  // apiKey: "AIzaSyAqB0fnbrfm61lK2cmOz2QwZhngjVvDIRQ",
  // authDomain: "khanmarket-75d3e.firebaseapp.com",
  // databaseURL: "https://khanmarket-75d3e.firebaseio.com",
  // projectId: "khanmarket-75d3e",
  // storageBucket: "khanmarket-75d3e.appspot.com",
  // messagingSenderId: "1076813179871",
  // appId: "1:1076813179871:web:c487c920c4a2ca9c35726a",
  // measurementId: "G-Z0RRLZEZWZ"
  apiKey: "AIzaSyAHy_ipt64IQL_eo_Rn6bmpPUPH3jtfe7o",
  authDomain: "thenode-54719.firebaseapp.com",
  databaseURL: "https://thenode-54719.firebaseio.com",
  projectId: "thenode-54719",
  storageBucket: "thenode-54719.appspot.com",
  messagingSenderId: "861217473561",
  appId: "1:861217473561:web:3bc090bd1c738311355688",
  measurementId: "G-X1SVKY39WS",
};

const fire = firebase.initializeApp(config);
export default fire;
