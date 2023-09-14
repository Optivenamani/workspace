import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ geojsonData }) => {
  const mapRef = useRef(null);
  const [plotsUnitsData, setPlotsUnitsData] = useState([]);

  useEffect(() => {
    console.log('geojsonData:', geojsonData);
    console.log('plotsUnitsData:', plotsUnitsData);

    if (!mapRef.current) {
      const projectCoordinates = [[40.710676837, -73.992635167], [40.705484672, -73.992717331], [40.705443545, -73.988194691], [40.710609004, -73.98806137]];
      const centerLat = projectCoordinates.reduce((sum, coord) => sum + coord[0], 0) / projectCoordinates.length;
      const centerLng = projectCoordinates.reduce((sum, coord) => sum + coord[1], 0) / projectCoordinates.length;
      
      mapRef.current = L.map('map').setView([centerLat, centerLng], 14);

      L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzklEQVRIDb3BAQEAAAABIP5mz6iDBTAYzFRMXAuN7ABTGYMKEzzLMvBDFRgwoTPsDAUxiwwTM82zIAxUYMKRM+wMBTGLDNEzPMDEUYMKRM+wMBTGJ6m8F9B5K3RgEoYMKRM+wMBTGYsM0TMsxMVGAwTKhM+wMBTGJ6SBDHAk4MwBaxjAzRM9bAtwRWWoMKEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwF9AAAAABJRU5ErkJggg==', {
        transparent: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Check if mapRef.current exists before adding the GeoJSON layer
    if (mapRef.current) {
      const geoJsonLayer = L.geoJSON(geojsonData, {
        style: styleFunction,
        onEachFeature: onEachFeature,
      });

      geoJsonLayer.addTo(mapRef.current);
    }

    // Fetch plotUnitsData from your API or data source
    fetch('http://localhost:8080/api/plots')
      .then((response) => response.json())
      .then((data) => {
        setPlotsUnitsData(data);
      })
      .catch((error) => {
        console.error('Error fetching plot units data:', error);
      });

  }, [plotsUnitsData]);

  // Define a function to style the GeoJSON features based on Unit_Status
  const styleFunction = (feature) => {
    const Unit_Number = feature.properties.Unit_Number;
    let fillColor = 'brown';
  
    if (plotsUnitsData) {
      const plotsInfo = plotsUnitsData.find((plots) => plots.Unit_Number === Unit_Number);
  
      if (plotsInfo) {
        const Unit_Status = plotsInfo.Unit_Status;
  
        if (Unit_Status === 'Open') {
          fillColor = 'red';
        } else if (Unit_Status === 'Reserved') {
          fillColor = 'yellow';
        } else if (Unit_Status === 'Sold') {
          fillColor = 'green';
        }
      }
    }
  
    return {
      fillColor: fillColor,
      fillOpacity: 0.9,
      color: 'black',
      weight: 2,
    };
  };
  

  const onEachFeature = (feature, layer) => {
    let popupContent = '<b>Plots Information</b><br />';

    if (feature.properties.project) {
      popupContent += `Plots Name: ${feature.properties.project}<br />`;
    }

    const Unit_Number = feature.properties.Unit_Number;

    if (plotsUnitsData) {
      const plotsInfo = plotsUnitsData.find((plots) => plots.Unit_Number === Unit_Number);

      if (plotsInfo) {
        popupContent += `Project Name: ${plotsInfo.Name}<br />`;
        popupContent += `Project ID: ${plotsInfo.project_id}<br />`;
        popupContent += `Unit_Status: ${plotsInfo.Unit_Status}<br />`;
        popupContent += `Plots ID: ${plotsInfo.Unit_Number}<br />`;
      }
    }

    layer.bindPopup(popupContent);
  };

  return <div id="map" style={{ height: '500px' }}>
  </div>;
};

export default MapComponent;
