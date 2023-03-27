import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateBooking from "./pages/CreateBooking";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-booking" element={<CreateBooking />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
