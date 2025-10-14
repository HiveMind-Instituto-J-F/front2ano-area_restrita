import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8080/HivemindWeb_war/checkSession", {
          method: "GET",
          credentials: "include"
        });

        if (!res.ok) {
          console.error("Erro ao buscar usuário:", res.status);
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        if (data.loggedIn) {
          setEmail(data.email || "");
        } else {
          // não logado: opcional redirecionar para login
          localStorage.setItem("lastPage", window.location.pathname);
          window.location.href = "http://localhost:8080/HivemindWeb_war/html/login.jsp";
        }
      } catch (err) {
        console.error("fetch currentUser erro:", err);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/HivemindWeb_war/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Erro no logout:", err);
    } finally {
      window.location.href = "http://localhost:8080/HivemindWeb_war/html/login.jsp";
    }
  };

  return (
    <div className="sidebar">
      <div className="user">
        <img
          className="avatar"
          src="https://i.guim.co.uk/img/media/d619fa31c267a9e7191e1ec40d4cd67f3c629924/37_0_592_355/master/592.jpg?width=620&dpr=1&s=none&crop=none"
          alt="avatar"
        />
        <div>
          <h4>{email ? email.split("@")[0] : "Usuário"}</h4>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboardRegular" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="fa-dashParada"></i> MicroParadas
            </NavLink>
          </li>
          <li>
            <NavLink to="/manutencao" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="fa-dashManutencao"></i> Manutenção
            </NavLink>
          </li>
          <li>
            <NavLink to="/chatbot" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="fa-chatBot"></i> Chatbot
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendario" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="fa-calendario"></i> Calendário
            </NavLink>
          </li>
          <li className="logout-item">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <i className="fa fa-sign-out-alt"></i> Sair
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
