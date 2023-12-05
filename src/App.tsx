import React from "react";
import "./theme/App.css";
import Layout from "./components/Layout.tsx";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
