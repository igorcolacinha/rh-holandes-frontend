import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

// Ícones simples em SVG (sem depender de biblioteca)
function Icon({ name }: { name: "grid" | "users" | "card" | "file" | "chev" }) {
  switch (name) {
    case "grid":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
          />
        </svg>
      );
    case "users":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 11a4 4 0 1 0-8 0a4 4 0 0 0 8 0Zm-4 6c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
          />
        </svg>
      );
    case "card":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v2h16V6a1 1 0 0 0-1-1H6Zm15 6H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7Z"
          />
        </svg>
      );
    case "file":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6 2h8l4 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V7h3.5L13 3.5Z"
          />
        </svg>
      );
    case "chev":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M9 6l6 6l-6 6" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar() {
  const location = useLocation();

  // abre submenu automaticamente quando estiver em /vr-vl...
  const isVrVlRoute = useMemo(() => location.pathname.startsWith("/vr-vl"), [location.pathname]);
  const [vrOpen, setVrOpen] = useState<boolean>(isVrVlRoute);

  return (
    <aside className="sb">
      <div className="sb__brand">
        <div className="sb__title">RH Holandes</div>
        <div className="sb__subtitle">Gestão de Benefícios</div>
      </div>

      <nav className="sb__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => cx("sb__item", isActive && "is-active")}
        >
          <span className="sb__icon"><Icon name="grid" /></span>
          <span className="sb__label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) => cx("sb__item", isActive && "is-active")}
        >
          <span className="sb__icon"><Icon name="users" /></span>
          <span className="sb__label">Colaboradores</span>
        </NavLink>

        {/* Grupo com submenu (Gestão VR/VL) */}
        <button
          type="button"
          className={cx("sb__item", "sb__item--button", isVrVlRoute && "is-active-soft")}
          onClick={() => setVrOpen((v) => !v)}
        >
          <span className="sb__icon"><Icon name="card" /></span>
          <span className="sb__label">Gestão VR/VL</span>
          <span className={cx("sb__chev", vrOpen && "is-open")}>
            <Icon name="chev" />
          </span>
        </button>

        {vrOpen && (
          <div className="sb__sub">
            <NavLink
              to="/vr-vl/parametros"
              className={({ isActive }) => cx("sb__subItem", isActive && "is-active")}
            >
              Parâmetros
            </NavLink>

            <NavLink
              to="/vr-vl/apuracao"
              className={({ isActive }) => cx("sb__subItem", isActive && "is-active")}
            >
              Apuração do Mês
            </NavLink>

            <NavLink
              to="/vr-vl/historico"
              className={({ isActive }) => cx("sb__subItem", isActive && "is-active")}
            >
              Histórico
            </NavLink>
          </div>
        )}

        <NavLink
          to="/recibos"
          className={({ isActive }) => cx("sb__item", isActive && "is-active")}
        >
          <span className="sb__icon"><Icon name="file" /></span>
          <span className="sb__label">Recibos Avulsos</span>
        </NavLink>
      </nav>

      <div className="sb__footer">© 2026 RH Holandes</div>
    </aside>
  );
}
