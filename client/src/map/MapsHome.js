import React from 'react';

const MapHome = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {/* Map 1 */}
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure className="px-10 pt-10">
          <img src="https://www.optiven.co.ke/wp-content/uploads/2023/09/joy-lovers-600x360.jpg" alt="Map 1" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Joy Lovers Club - Malindi</h2>
          <p>Any additional map information goes here.</p>
          <div className="card-actions">
            <a href="/joy-lovers" className="btn btn-primary">View Map</a>
          </div>
        </div>
      </div>

      {/* Map 2 */}
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure className="px-10 pt-10">
          <img src="https://www.optiven.co.ke/wp-content/uploads/2023/08/great-oasis-nanyuki.jpeg" alt="Map 2" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Great Oasis Gardens</h2>
          <p>Any additional map information goes here.</p>
          <div className="card-actions">
            <a href="/oasis-gardens" className="btn btn-primary">View Map</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapHome;
