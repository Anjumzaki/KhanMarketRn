import {
    SEARCH_DATA1,
    SEARCH_DATA1_LOADING,
    SEARCH_DATA1_ERROR,
  } from "../actions";
  
  const searchData1 = {
    searchData1: '',
    search1Loading: false,
    search1Error: "",
  };
  
  export default (state = searchData1, action) => {
    switch (action.type) { 
      case SEARCH_DATA1:
        return {
          ...state,
          searchData1: action.payload
        };
      case SEARCH_DATA1_LOADING:
        return {
          ...state,
          search1Loading: action.payload
        };
      case SEARCH_DATA1_ERROR:
        return {
          ...state,
          search1Error: action.payload
        };
      default:
        return state;
    }
  };
  