export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>RH Holandes</h1>
      <span>Gestão de Benefícios</span>

      <div className="menu">
        <div className="menu-item active">Dashboard</div>
        <div className="menu-item">Colaboradores</div>
        <div className="menu-item">Gestão VR/VL</div>
        <div className="menu-item">Recibos Avulsos</div>
      </div>
    </aside>
  );
}
