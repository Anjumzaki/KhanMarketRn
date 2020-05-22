import {
    FAV_STORE_DATA,
    FAV_STORE_DATA_LOADING,
    FAV_STORE_DATA_ERROR,
  } from "../actions";
  
  const favStoreData = {
    favStoreData: '',
    favStoreLoading: false,
    favStoreError: "",
  };
  
  export default (state = favStoreData, action) => {
    switch (action.type) { 
      case FAV_STORE_DATA:
        return {
          ...state,
          favStoreData: action.payload
        };
      case FAV_STORE_DATA_LOADING:
        return {
          ...state,
          favStoreLoading: action.payload
        };
      case FAV_STORE_DATA_ERROR:
        return {
          ...state,
          favStoreError: action.payload
        };
      default:
        return state;
    }
  };
  