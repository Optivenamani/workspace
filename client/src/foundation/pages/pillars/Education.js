import React from "react";
import Sidebar from "../../components/Sidebar";

const Education = () => {
  return (
    <Sidebar>
      <section className="text-center">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1 */}
          <div className="card w-72 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          {/* 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card w-72 bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>

            {/* Repeat the above card component for the other 3 cards */}
            {/* ... */}
          </div>
          {/* 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card w-72 bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>

            {/* Repeat the above card component for the other 3 cards */}
            {/* ... */}
          </div>
          {/* 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card w-72 bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>

            {/* Repeat the above card component for the other 3 cards */}
            {/* ... */}
          </div>
        </div>
      </section>
    </Sidebar>
  );
};

export default Education;
