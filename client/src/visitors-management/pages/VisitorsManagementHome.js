import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const VisitorsManagementHome = () => {
  return (
    <Sidebar>
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-96 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt="Pattern"
              src="https://images.unsplash.com/photo-1638184984605-af1f05249a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="block text-white text-4xl">🛎️</div>

              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl uppercase">
                Welcome to Optiven Visitors Management Platform
              </h1>
              <div className="mt-10">
                <Link
                  to="/register-visitor"
                  className="btn btn-primary text-white"
                >
                  Register Visitor
                </Link>
                <Link to="/view-visitors" className="btn btn-outline ml-1">
                  View Visitors
                </Link>
              </div>
            </div>
          </main>
        </div>
      </section>
    </Sidebar>
  );
};

export default VisitorsManagementHome;
