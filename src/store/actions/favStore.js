
export const FAV_STORE_DATA = "FAV_STORE_DATA";
export const FAV_STORE_DATA_LOADING = "FAV_STORE_DATA_LOADING";
export const FAV_STORE_DATA_ERROR = "FAV_STORE_DATA_ERROR";

export const favStoreAsync = (favStore) => {
  return (dispatch, getState) => {
   
    dispatch(favStoreLoading(true))
    
      dispatch(favStoreFunction(favStore));
      dispatch(favStoreLoading(false))
    
  };
};



export const favStoreFunction = (payload) => {
  return {
    type: FAV_STORE_DATA,
    payload
  };
};

export const favStoreLoading = (payload) => {
  return {
    type: FAV_STORE_DATA_LOADING,
    payload
  };
};

export const favStoreError = (payload) => {
  return {
    type: FAV_STORE_DATA_ERROR,
    payload
  };
}; 


