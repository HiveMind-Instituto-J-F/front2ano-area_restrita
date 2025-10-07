import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <div className="sidebar">
    <div className="user">
      <img
        className="avatar"
        src="https://i.guim.co.uk/img/media/d619fa31c267a9e7191e1ec40d4cd67f3c629924/37_0_592_355/master/592.jpg?width=620&dpr=1&s=none&crop=none"
        alt="avatar"
      />
      <div>
        <h4>Gustavo</h4>
        <p>Admin</p>
      </div>
    </div>
    <nav>
      <ul>
        <li>
          <NavLink
            to="/dashboardRegular"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-dashParada"></i> MicroParadas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/manutencao"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-dashManutencao"></i> Manutenção
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chatbot"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-chatBot"></i> Chatbot
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendario"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa-calendario"></i> Calendário
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
