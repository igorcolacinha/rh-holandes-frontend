export type EmployeeListItem = {
  id: number | string;
  nomeCompleto?: string;
  email?: string;
  nomeCargo?: string;
  status?: string; // ATIVO | AFASTADO | ...
};
