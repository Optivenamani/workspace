// src/map/Legend.js
import React from 'react';

const legendStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  margin: '10px',
};

const legendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '5px 0',
};

const legendColorStyle = {
  width: '20px',
  height: '20px',
  marginRight: '10px',
};

const Legend = () => {
  return (
    <div className="legend" style={legendStyle}>
      <div className="legend-heading" style={{ textTransform: 'uppercase', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px' }}>
        LEGEND
      </div>
      <div className="legend-item" style={legendItemStyle}>
        <div className="legend-color" style={{ ...legendColorStyle, backgroundColor: 'green' }}></div>
        <div className="legend-label">Open Plots</div>
      </div>
      <div className="legend-item" style={legendItemStyle}>
        <div className="legend-color" style={{ ...legendColorStyle, backgroundColor: 'yellow' }}></div>
        <div className="legend-label">Reserved Plots</div>
      </div>
      <div className="legend-item" style={legendItemStyle}>
        <div className="legend-color" style={{ ...legendColorStyle, backgroundColor: 'red' }}></div>
        <div className="legend-label">Sold Plots</div>
      </div>
      <div className="legend-item" style={legendItemStyle}>
        <div className="legend-color" style={{ ...legendColorStyle, backgroundColor: 'transparent', border: '1px solid black' }}></div>
        <div className="legend-label">Click on the individual plots to view plot info</div>
      </div>
    </div>
  );
};

export default Legend;
