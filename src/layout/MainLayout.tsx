import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Topbar />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
