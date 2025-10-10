import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar";
import DashboardRegular from "./pages/DashboardRegular";
import DashboardManutencao from "./pages/DashboardManutencao";
import CalendarView from "./pages/Calendario";
import Chatbot from "./pages/Chatbot";
import "./App.css";

function App() {

  useEffect(() => {
    fetch("/HivemindWeb_war/checkSession", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          const lastPage = localStorage.getItem("lastPage");
          if (lastPage) {
            localStorage.removeItem("lastPage");
            navigate(lastPage);
          }
        } else {
          localStorage.setItem("lastPage", window.location.pathname);
          window.location.href = "/HivemindWeb_war/html/login.jsp";
        }
      });
  }, []);


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
              <Route
                path="/calendario"
                element={
                  <div className="calendar-page-container">
                    <CalendarView />
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
