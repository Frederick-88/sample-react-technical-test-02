export const addSearchKeywords = (item) => {
  return (dispatch) => {
    dispatch({
      type: "ADD_SEARCH_KEYWORDS",
      payload: item,
    });
  };
};

export const addSearchResult = (item) => {
  return (dispatch) => {
    dispatch({
      type: "ADD_SEARCH_RESULT",
      payload: item,
    });
  };
};

export const clearSearchHistory = () => {
  return (dispatch) => {
    dispatch({
      type: "CLEAR_SEARCH_HISTORY",
    });
  };
};
