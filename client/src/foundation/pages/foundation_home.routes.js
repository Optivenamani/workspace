import React from "react";
import Sidebar from "../components/Sidebar";

const VisitorsManagementHome = () => {
  return (
    <Sidebar>
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-96 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt="Pattern"
              src={require("../../assets/media/reception.jpeg")}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="block text-white text-4xl">🛎️</div>

              <h1 className="mt-6 text-5xl font-bold text-gray-900 sm:text-3xl md:text-7xl lausanne">
                Welcome to the <span className="sometimes-italic tracking-wider font-thin">Optiven Visitors Management Platform.</span>
              </h1>
              <div className="mt-5">
                <p className="italic">
                  Access the menu from the{" "}
                  <span className="font-bold underline">sidebar</span> on the <span className="font-bold underline">top left</span> to get started.
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </Sidebar>
  );
};

export default foundation_home;
