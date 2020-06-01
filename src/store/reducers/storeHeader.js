import {
    GET_STORE_DATA1,
    GET_STORE_DATA_LOADING1,
    GET_STORE_DATA_ERROR1,
  } from "../actions";
  
  const storeData1 = {
    storeData1: "",
    storeLoading1: false,
    storeError1: "",
  };
  
  export default (state = storeData1, action) => {
    switch (action.type) { 
      case GET_STORE_DATA1:
        return {
          ...state,
          storeData1: action.payload
        }; 
      case GET_STORE_DATA_LOADING1:
        return {
          ...state,
          storeLoading1: action.payload
        };
      case GET_STORE_DATA_ERROR1:
        return {
          ...state,
          storeError1: action.payload
        };
      default:
        return state;
    }
  };
  