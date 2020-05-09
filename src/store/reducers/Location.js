import {
    LOCATION_DATA,
    LOCATION_DATA_LOADING,
    LOCATION_DATA_ERROR,
  } from "../actions";
  
  const locationData = {
    locationData: '',
    locationLoading: false,
    locationError: "",
  };
  
  export default (state = locationData, action) => {
    switch (action.type) { 
      case LOCATION_DATA:
        return {
          ...state,
          locationData: action.payload
        };
      case LOCATION_DATA_LOADING:
        return {
          ...state,
          locationLoading: action.payload
        };
      case LOCATION_DATA_ERROR:
        return {
          ...state,
          locationError: action.payload
        };
      default:
        return state;
    }
  };
  