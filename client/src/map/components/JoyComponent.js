import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Legend from './Legend';
import test from './Screenshot_2023-09-14_095604-removebg-preview.png';
import left from './left-removebg-preview.png';
import logo from './logo-removebg-preview.png';
import key from './key.png';
import community from './community.PNG';
import access from './access.PNG';


const MapComponent = ({ geojsonData }) => {
    const mapRef = useRef(null);
    const [plotsUnitsData, setPlotsUnitsData] = useState([]);

    const [imageOverlays, setImageOverlays] = useState([
        {
          imageUrl: test,
          imageBounds: [[74.133300889, -164.11380051], [68.260197411, -86.418488011]] 
        },
        {
          imageUrl: test,
          imageBounds: [[16.864913627, -159.27981614], [-17.248458657, -52.05325364]] 
        },
        {
            // find new image
            imageUrl: left,
            imageBounds: [[66.60827, -74.02591], [48.14953, -57.67827]] 
          },
          {
            // find new image
            imageUrl: left,
            imageBounds: [[64.88144 , -181.18854], [-17.679222, -157.93750]] 
          },
          {
            //banner
            imageUrl: logo,
            imageBounds: [[76.44939, -23.92825], [70.16178, 17.38034]] 
          }, 
          {
            //key
            imageUrl: key,
            imageBounds: [[24.10405, -56.44778], [-14.02811, -1.95560]] 
          }, 
          {
            //community
            imageUrl: community,
            imageBounds: [[66.11492, -136.16458], [65.53909, -125.26614]] 
          }, 
          {
            //access
            imageUrl: access,
            imageBounds: [[64.49998, -81.84818], [59.56628, -80.26614]] 
          }, 
        // Add more images as needed
      ]);
      
  
      const addImageOverlays = () => {
        imageOverlays.forEach(({ imageUrl, imageBounds }) => {
          if (mapRef.current) {
            const imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(mapRef.current);
            imageOverlay.bringToFront();
          } else {
            console.error('Map instance not available.');
          }
        });
      };      
  
    useEffect(() => {
      console.log('geojsonData:', geojsonData);
      console.log('plotsUnitsData:', plotsUnitsData);
  
      if (!mapRef.current && geojsonData.features.length > 0) {
        const firstFeature = geojsonData.features[0];
        const coordinates = firstFeature.geometry.coordinates[0];
  
        if (coordinates.length >= 3) {
          const centerLng = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
          const centerLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
  
          mapRef.current = L.map('map').setView([centerLat, centerLng], 3);
  
          L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzklEQVRIDb3BAQEAAAABIP5mz6iDBTAYzFRMXAuN7ABTGYMKEzzLMvBDFRgwoTPsDAUxiwwTM82zIAxUYMKRM+wMBTGLDNEzPMDEUYMKRM+wMBTGJ6m8F9B5K3RgEoYMKRM+wMBTGYsM0TMsxMVGAwTKhM+wMBTGJ6SBDHAk4MwBaxjAzRM9bAtwRWWoMKEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwFMb7JzEz7AwF9AAAAABJRU5ErkJggg==').addTo(mapRef.current);  // Add your tile layer here
  
          // Call the function to add image overlay after initializing the map
          addImageOverlays();
        } else {
          console.error('Invalid coordinates.');
        }
      }
  
    if (mapRef.current) {
      const geoJsonLayer = L.geoJSON(geojsonData, {
        style: styleFunction,
        onEachFeature: onEachFeature,
      });
  
      geoJsonLayer.addTo(mapRef.current);
    }


    // Fetch plotUnitsData from your API or data source
    fetch('https://workspace.optiven.co.ke/api/plots')
      .then((response) => response.json())
      .then((data) => {
        setPlotsUnitsData(data);
      })
      .catch((error) => {
        console.error('Error fetching plot units data:', error);
      });

    }, [geojsonData.features.length, plotsUnitsData]);

  // Define a function to style the GeoJSON features based on Unit_Status
  const styleFunction = (feature) => {
    const Unit_Number = feature.properties.Unit_Number;
    let fillColor = 'brown';

    if (plotsUnitsData) {
      const plotsInfo = plotsUnitsData.find((plots) => plots.Unit_Number === Unit_Number);

      if (plotsInfo) {
        const Unit_Status = plotsInfo.Unit_Status;

        if (Unit_Status === 'Open') {
          fillColor = 'green';
        } else if (Unit_Status === 'Reserved') {
          fillColor = 'yellow';
        } else if (Unit_Status === 'Sold') {
          fillColor = 'red';
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
        const plotIdLabel = L.divIcon({
          className: 'plot-id-label',
          html: `${plotsInfo.Unit_Number}`,
          iconSize: [50, 20]
        });

        L.marker(layer.getBounds().getCenter(), { icon: plotIdLabel }).addTo(mapRef.current);

        // Bind a popup with the rest of the data
        layer.bindPopup(`
          <b>Plots Information</b><br />
          Project Name: ${plotsInfo.Name}<br />
          Plots ID: ${plotsInfo.Unit_Number}<br />
          Project ID: ${plotsInfo.project_id}<br />
          Unit_Status: ${plotsInfo.Unit_Status}<br />
          Price: ${plotsInfo.Cash_Price}<br />
          Plot Size: ${plotsInfo.Unit_Type}<br />
        `);
      }
    }
  };

 
  
  const onEachFeatureLineString = (feature, layer) => {
    const name = feature.properties.name;
    const coordinates = feature.geometry.coordinates;

    const midPoint = calculateMidPoint(coordinates);

    const label = L.divIcon({
      className: 'line-label',
      html: `<b>${name}</b>`,
      iconSize: [100, 20],
      iconAnchor: [50, 10],
    });

    L.marker(midPoint, { icon: label }).addTo(mapRef.current);
  };

  const calculateMidPoint = (coordinates) => {
    const numCoords = coordinates.length;
    let sumLat = 0;
    let sumLng = 0;

    for (let i = 0; i < numCoords; i++) {
      sumLat += coordinates[i][1];
      sumLng += coordinates[i][0];
    }

    const midLat = sumLat / numCoords;
    const midLng = sumLng / numCoords;

    return [midLat, midLng];
  };
  

  return <div id="map" style={{ height: '450px' }}></div>;
};

export default MapComponent;
