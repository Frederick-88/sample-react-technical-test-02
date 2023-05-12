const initialState = {
  searchKeywords: [],
  searchResult: [],
};

const GlobalReducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case "ADD_SEARCH_KEYWORDS":
      return {
        ...state,
        searchKeywords: [...state.searchKeywords, payload],
      };

    case "ADD_SEARCH_RESULT":
      return {
        ...state,
        searchResult: [...state.searchResult, payload],
      };

    case "CLEAR_SEARCH_HISTORY":
      return {
        ...state,
        searchKeywords: [],
        searchResult: [],
      };

    default:
      return state;
  }
};

export default GlobalReducer;
