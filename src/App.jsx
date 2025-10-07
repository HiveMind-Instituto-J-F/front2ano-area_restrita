import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import DashboardRegular from "./pages/DashboardRegular";
import DashboardManutencao from "./pages/DashboardManutencao";
import CalendarView from "./pages/Calendario";
import Chatbot from "./pages/Chatbot";
import "./App.css";


function App() {
  return (
    <div className="app">
      <div className="main">
        <header className="header">
          <div className="logo">HIVEMIND</div>
        </header>
        <div className="content">
          <Sidebar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboardRegular" replace />} />
              <Route path="/dashboardRegular" element={<DashboardRegular />} />
              <Route path="/manutencao" element={<DashboardManutencao />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/calendario" element={<div className="calendar-page-container"><CalendarView /></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
