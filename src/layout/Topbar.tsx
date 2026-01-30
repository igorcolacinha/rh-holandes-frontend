import { Link } from "react-router-dom";
import "../styles/Topbar.css";

function formatarDataHoje() {
  const hoje = new Date();

  return hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function Topbar() {
  return (
    <header className="topbar">
      <div>
        <strong>Bem-vindo de volta!</strong>
        <div style={{ fontSize: 13, color: "#6b7280", textTransform: "capitalize" }}>
          {formatarDataHoje()}
        </div>
      </div>

      <div className="topbar-right">
        <Link
          to="/configuracoes"
          className="topbar-icon-btn"
          aria-label="Abrir configurações"
          title="Configurações"
        >
          {/* Ícone engrenagem (SVG inline pra não depender de lib) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M19.4 15a7.9 7.9 0 0 0 .1-1l2-1.5-2-3.5-2.4.6a8 8 0 0 0-1.7-1L15 6l-4-.5L9.6 7.6a8 8 0 0 0-1.7 1L5.5 8 3.5 11.5l2 1.5a7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.5 2.4-.6a8 8 0 0 0 1.7 1L9 18l4 .5 1.4-2.1a8 8 0 0 0 1.7-1l2.4.6 2-3.5-2-1.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="topbar-user">
          <strong>Admin RH</strong>
        </div>
      </div>
    </header>
  );
}
