
export const SEARCH_DATA = "SEARCH_DATA";
export const SEARCH_DATA_LOADING = "SEARCH_DATA_LOADING";
export const SEARCH_DATA_ERROR = "SEARCH_DATA_ERROR";

export const searchAsync = (search) => {
  return (dispatch, getState) => {
   
    dispatch(searchLoading(true))

   
      dispatch(searchFunction(search));
      dispatch(searchLoading(false));
    
  };
};



export const searchFunction = (payload) => {
  return {
    type: SEARCH_DATA,
    payload
  };
};

export const searchLoading = (payload) => {
  return {
    type: SEARCH_DATA_LOADING,
    payload
  };
};

export const searchError = (payload) => {
  return {
    type: SEARCH_DATA_ERROR,
    payload
  };
}; 


