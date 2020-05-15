
export const SEARCH_DATA1 = "SEARCH_DATA1";
export const SEARCH_DATA1_LOADING = "SEARCH_DATA1_LOADING";
export const SEARCH_DATA1_ERROR = "SEARCH_DATA1_ERROR";

export const search1Async = (search1) => {
  return (dispatch, getState) => {
   
    dispatch(search1Loading(true))

   
      dispatch(search1Function(search1));
      dispatch(search1Loading(false));
    
  };
};



export const search1Function = (payload) => {
  return {
    type: SEARCH_DATA1,
    payload
  };
};

export const search1Loading = (payload) => {
  return {
    type: SEARCH_DATA1_LOADING,
    payload
  };
};

export const search1Error = (payload) => {
  return {
    type: SEARCH_DATA1_ERROR,
    payload
  };
}; 


