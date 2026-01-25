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

      <div>
        <strong>Admin RH</strong>
      </div>
    </header>
  );
}
