import {
    FILTER_DATA,
    FILTER_DATA_LOADING,
    FILTER_DATA_ERROR,
  } from "../actions";
  
  const filterData = {
    filterData: 'Asc',
    filterLoading: false,
    filterError: "",
  };
  
  export default (state = filterData, action) => {
    switch (action.type) { 
      case FILTER_DATA:
        return {
          ...state,
          filterData: action.payload
        };
      case FILTER_DATA_LOADING:
        return {
          ...state,
          filterLoading: action.payload
        };
      case FILTER_DATA_ERROR:
        return {
          ...state,
          filterError: action.payload
        };
      default:
        return state;
    }
  };
  