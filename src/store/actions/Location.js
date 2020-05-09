
export const LOCATION_DATA = "LOCATION_DATA";
export const LOCATION_DATA_LOADING = "LOCATION_DATA_LOADING";
export const LOCATION_DATA_ERROR = "LOCATION_DATA_ERROR";

export const locationAsync = (location) => {
  return (dispatch, getState) => {
   
    dispatch(locationLoading(true))

   
      dispatch(locationFunction(location));
      dispatch(locationLoading(false))
    
  };
};



export const locationFunction = (payload) => {
  return {
    type: LOCATION_DATA,
    payload
  };
};

export const locationLoading = (payload) => {
  return {
    type: LOCATION_DATA_LOADING,
    payload
  };
};

export const locationError = (payload) => {
  return {
    type: LOCATION_DATA_ERROR,
    payload
  };
}; 


