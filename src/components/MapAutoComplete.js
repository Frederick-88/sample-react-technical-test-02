import React, { useEffect, useState, useRef } from "react";
import loadScript from "load-script";
import { connect } from "react-redux";
import {
  addSearchKeywords,
  addSearchResult,
} from "../actionCreators/GlobalAction";

import { Checkbox, TextField } from "@mui/material";

/* global google */
const MapAutoComplete = (props) => {
  // -----
  // State
  // -----
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef();

  // -------
  // Methods
  // -------
  const initializeMap = (googleMapsApi) => {
    // using "useRef" can, using "getElementById" also can
    const map = new googleMapsApi.Map(mapRef.current, {
      center: { lat: 40.749933, lng: -73.98633 },
      zoom: 13,
      mapTypeControl: false,
    });

    const card = document.getElementById("pac-card");
    const input = document.getElementById("pac-input");
    const biasInputElement = document.getElementById("use-location-bias");
    const strictBoundsInputElement =
      document.getElementById("use-strict-bounds");
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"],
    };

    map.controls[googleMapsApi.ControlPosition.TOP_LEFT].push(card);

    const autocomplete = new googleMapsApi.places.Autocomplete(input, options);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    const infowindow = new googleMapsApi.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");

    infowindow.setContent(infowindowContent);

    const marker = new googleMapsApi.Marker({
      map,
      anchorPoint: new googleMapsApi.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();
      props.addSearchKeywords(place.name);
      props.addSearchResult(place.formatted_address);

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent =
        place.formatted_address;
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      const radioButton = document.getElementById(id);

      radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
        input.value = "";
      });
    }

    setupClickListener("changetype-all", []);
    setupClickListener("changetype-address", ["address"]);
    setupClickListener("changetype-establishment", ["establishment"]);
    setupClickListener("changetype-geocode", ["geocode"]);
    setupClickListener("changetype-cities", ["(cities)"]);
    setupClickListener("changetype-regions", ["(regions)"]);

    biasInputElement.addEventListener("change", () => {
      if (biasInputElement.checked) {
        autocomplete.bindTo("bounds", map);
      } else {
        // User wants to turn off location bias, so three things need to happen:
        // 1. Unbind from map
        // 2. Reset the bounds to whole world
        // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
        autocomplete.unbind("bounds");
        autocomplete.setBounds({
          east: 180,
          west: -180,
          north: 90,
          south: -90,
        });
        strictBoundsInputElement.checked = biasInputElement.checked;
      }

      input.value = "";
    });

    strictBoundsInputElement.addEventListener("change", () => {
      autocomplete.setOptions({
        strictBounds: strictBoundsInputElement.checked,
      });
      if (strictBoundsInputElement.checked) {
        biasInputElement.checked = strictBoundsInputElement.checked;
        autocomplete.bindTo("bounds", map);
      }

      input.value = "";
    });
  };

  // ---------
  // Lifecycle
  // ---------
  useEffect(() => {
    setIsLoading(true);

    window.initializeMap = () => {
      initializeMap(google.maps);
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_API_KEY}&callback=initializeMap&libraries=places`,
      { defer: true },
      () => {
        setIsLoading(false);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="map-auto-complete">
      {isLoading ? <p className="loading-text">Loading...</p> : <></>}

      <div className="pac-card" id="pac-card">
        <div>
          <div id="title">Google Maps Search</div>
          <div id="type-selector" className="pac-controls controls--radio">
            <input
              type="radio"
              name="type"
              id="changetype-all"
              defaultChecked
            />
            <label htmlFor="changetype-all">All</label>

            <input type="radio" name="type" id="changetype-establishment" />
            <label htmlFor="changetype-establishment">establishment</label>

            <input type="radio" name="type" id="changetype-address" />
            <label htmlFor="changetype-address">address</label>

            <input type="radio" name="type" id="changetype-geocode" />
            <label htmlFor="changetype-geocode">geocode</label>

            <input type="radio" name="type" id="changetype-cities" />
            <label htmlFor="changetype-cities">(cities)</label>

            <input type="radio" name="type" id="changetype-regions" />
            <label htmlFor="changetype-regions">(regions)</label>
          </div>
          <br />
          <div id="strict-bounds-selector" className="pac-controls">
            <Checkbox id="use-location-bias" value="" defaultChecked />
            <label htmlFor="use-location-bias">Bias to map viewport</label>
            <Checkbox id="use-strict-bounds" value="" />
            <label htmlFor="use-strict-bounds">Strict bounds</label>
          </div>
        </div>
        <div id="pac-container">
          <TextField
            id="pac-input"
            type="text"
            placeholder="Enter a location"
          />
        </div>
      </div>
      <div id="map" ref={mapRef}></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <br />
        <span id="place-address"></span>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  addSearchKeywords,
  addSearchResult,
};

export default connect(null, mapDispatchToProps)(MapAutoComplete);
