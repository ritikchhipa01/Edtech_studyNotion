import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
function App() {
  return (
    <React.Fragment>
      <div className={"w-screen min-h-screen bg-richblack-900 flex flex-col font-inter"}>
        <Routes>
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
