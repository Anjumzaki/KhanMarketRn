
export const FILTER_DATA = "FILTER_DATA";
export const FILTER_DATA_LOADING = "FILTER_DATA_LOADING";
export const FILTER_DATA_ERROR = "FILTER_DATA_ERROR";

export const filterAsync = (filter) => {
  return (dispatch, getState) => {
   
    dispatch(filterLoading(true))

   
      dispatch(filterFunction(filter));
      dispatch(filterLoading(false))
    
  };
};



export const filterFunction = (payload) => {
  return {
    type: FILTER_DATA,
    payload
  };
};

export const filterLoading = (payload) => {
  return {
    type: FILTER_DATA_LOADING,
    payload
  };
};

export const filterError = (payload) => {
  return {
    type: FILTER_DATA_ERROR,
    payload
  };
}; 


