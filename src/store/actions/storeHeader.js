
export const GET_STORE_DATA1 = "GET_STORE_DATA1";
export const GET_STORE_DATA_LOADING1 = "GET_STORE_DATA_LOADING1";
export const GET_STORE_DATA_ERROR1 = "GET_STORE_DATA_ERROR1";

export const storeHeaderAsync = (store) => {
  return (dispatch, getState) => {
   
    dispatch(storeLoading1(true))

   
      dispatch(storeFunction1(store));
      dispatch(storeLoading1(false))
    
  };
};



export const storeFunction1 = (payload) => { 
  return {
    type: GET_STORE_DATA1,
    payload
  };
};

export const storeLoading1 = (payload) => {
  return {
    type: GET_STORE_DATA_LOADING1,
    payload
  };
};

export const storeError1 = (payload) => {
  return {
    type: GET_STORE_DATA_ERROR1,
    payload
  };
}; 


