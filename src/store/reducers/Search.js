import {
    SEARCH_DATA,
    SEARCH_DATA_LOADING,
    SEARCH_DATA_ERROR,
  } from "../actions";
  
  const searchData = {
    searchData: '',
    searchLoading: false,
    searchError: "",
  };
  
  export default (state = searchData, action) => {
    switch (action.type) { 
      case SEARCH_DATA:
        return {
          ...state,
          searchData: action.payload
        };
      case SEARCH_DATA_LOADING:
        return {
          ...state,
          searchLoading: action.payload
        };
      case SEARCH_DATA_ERROR:
        return {
          ...state,
          searchError: action.payload
        };
      default:
        return state;
    }
  };
  