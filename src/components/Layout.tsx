import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import ParticleBackground from "./ParticleBackground";

const Layout = () => (
  <div className="min-h-screen bg-background noise relative">
    <ParticleBackground />
    <AppSidebar />
    <main className="ml-[270px] p-10 min-h-screen relative z-10">
      <Outlet />
    </main>
  </div>
);

export default Layout;
