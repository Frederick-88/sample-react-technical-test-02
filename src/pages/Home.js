import React from "react";
import "../assets/styles/pages/home.scss";
import MapAutoComplete from "../components/MapAutoComplete";

import { connect } from "react-redux";
import { clearSearchHistory } from "../actionCreators/GlobalAction";

import { Button } from "@mui/material";

const Home = (props) => {
  // ----------
  // Components
  // ----------
  const historyKeywordsComponent = () => {
    if (props.searchKeywords.length) {
      return (
        <div className="history-list list--keywords">
          <h4 className="history-list__title">Keywords</h4>

          {props.searchKeywords.map((item, index) => {
            return (
              <p key={index}>
                ({index + 1}) - {item}
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const historyResultComponent = () => {
    if (props.searchResult.length) {
      return (
        <div className="history-list list--results">
          <h4 className="history-list__title">Results</h4>

          {props.searchResult.map((item, index) => {
            return (
              <p key={index}>
                ({index + 1}) - {item}
              </p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  // --------
  // Computed
  // --------
  const hasSearchHistory = () => {
    return props.searchKeywords.length && props.searchResult.length;
  };

  // -------
  // Methods
  // -------
  const doClearSearchHistory = () => {
    props.clearSearchHistory();
  };

  return (
    <div className="home">
      <h1 className="title">AppFuxion Technical Test Page</h1>

      <hr className="divider-line" />

      <div className="search-history">
        <h3 className="history-title">Search History</h3>

        {!hasSearchHistory() ? (
          <p className="no-history-text">
            No Search History Found - Start Your Search Below.
          </p>
        ) : (
          <></>
        )}

        {historyKeywordsComponent()}
        {historyResultComponent()}

        {hasSearchHistory() ? (
          <Button
            className="clear-history-btn"
            variant="outlined"
            onClick={doClearSearchHistory}
          >
            Clear All Search History
          </Button>
        ) : (
          <></>
        )}
      </div>

      <MapAutoComplete />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    searchKeywords: state.GlobalReducer.searchKeywords,
    searchResult: state.GlobalReducer.searchResult,
  };
};

const mapDispatchToProps = {
  clearSearchHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
